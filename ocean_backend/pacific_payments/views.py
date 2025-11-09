from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import OceanOrder
import razorpay
import json
import hmac
import hashlib
from .models import OceanOrder,RazorpayWebhookLog,PaymentHistory
from rest_framework import generics, permissions
from .serializers import PaymentHistorySerializer
from django.utils import timezone
from .utils import save_and_email_invoice
from .models import OceanInvoice
from django.http import FileResponse ,Http404
from django.db.models import Sum,Count
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta

@csrf_exempt
def create_order(request):
    """
    ✅ Create a Razorpay order and link it to the logged-in user.
    Keeps logic compatible with your frontend.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            amount = int(float(data.get('amount', 0)) * 100)  # convert ₹ to paise
            user_id = data.get('user_id')

            if not user_id:
                return JsonResponse({"error": "user_id is required"}, status=400)

            # Ensure user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

            # Create Razorpay order
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            payment = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1
            })

            # Create order in DB (linked to user)
            order = OceanOrder.objects.create(
                user=user,
                order_id=payment["id"],
                amount=float(data["amount"]),
                is_paid=False
            )

            #  Return order details for frontend checkout
            return JsonResponse({
                "order_id": payment["id"],
                "key": settings.RAZORPAY_KEY_ID,
                "amount": data["amount"],
                "currency": "INR",
                "user_id": user.id
            })

        except Exception as e:
            print("❌ Error creating Razorpay order:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)



@csrf_exempt
def verify_payment(request):
    """
     Verify payment securely.
    Checks if the order belongs to the user who created it.
    Updates order status after successful verification.
    Logs payment history for each successful payment.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")

            if not user_id:
                return JsonResponse({"error": "user_id is required"}, status=400)

            # Ensure the user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            # Step 1: Verify Razorpay signature
            client.utility.verify_payment_signature({
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_signature": data["razorpay_signature"],
            })

            #  Step 2: Fetch payment info
            payment_info = client.payment.fetch(data["razorpay_payment_id"])

            # Step 3: Find and update order for this user
            order = OceanOrder.objects.get(order_id=data["razorpay_order_id"], user=user)
            order.is_paid = True
            order.payment_id = data["razorpay_payment_id"]
            order.status = payment_info.get("status", "paid")
            order.method = payment_info.get("method")
            order.email = payment_info.get("email")
            order.contact = payment_info.get("contact")
            order.currency = payment_info.get("currency", "INR")
            order.save()

            # Step 4: Create Payment History record
            payment_history=PaymentHistory.objects.create(
                user=user,
                order_id=data["razorpay_order_id"],
                payment_id=data["razorpay_payment_id"],
                amount=order.amount,
                method=order.method or payment_info.get("method", "unknown"),
                status="success",
            )
            # step 5 create and email invoice 
            invoice, created = OceanInvoice.objects.get_or_create(
                payment=payment_history,
                defaults={
                    "user": user,
                    "order": order,
                    "invoice_number": f"INV-{user.id}-{int(timezone.now().timestamp())}",
                    "issue_date": timezone.now(),
                    "due_date": timezone.now() + timedelta(days=7),
                },
            )
            # ✅ Step 6: Generate & send invoice (only if newly created)
            if created:
                save_and_email_invoice(order=order, user=user, payment=payment_history)

            print(f"✅ Payment verified and invoice handled for user {user.username}, order {order.order_id}")
            return JsonResponse({"status": "Payment Successful"})

        except OceanOrder.DoesNotExist:
            return JsonResponse({"status": "Order not found for this user"}, status=403)
        except razorpay.errors.SignatureVerificationError:
            return JsonResponse({"status": "Signature verification failed"}, status=400)
        except Exception as e:
            print("❌ Payment verification error:", e)
            return JsonResponse({"status": "Payment Verification Failed", "error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

# webhook to handle razorpay payment status updates 
@csrf_exempt
def razorpay_webhook(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=400)

    try:
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
        received_signature = request.headers.get("X-Razorpay-Signature")
        body = request.body.decode()

        # ✅ Verify signature
        generated_signature = hmac.new(
            webhook_secret.encode(), body.encode(), hashlib.sha256
        ).hexdigest()

        if received_signature != generated_signature:
            return JsonResponse({"error": "Invalid signature"}, status=400)

        # ✅ Parse and log webhook payload
        data = json.loads(body)
        RazorpayWebhookLog.objects.create(
            event=data.get("event"),
            payload=data
        )

        # ✅ Handle specific events
        event = data.get("event")
        if event == "payment.captured":
            order_id = data["payload"]["payment"]["entity"]["order_id"]
            OceanOrder.objects.filter(order_id=order_id).update(status="PAID")

        elif event == "payment.failed":
            order_id = data["payload"]["payment"]["entity"]["order_id"]
            OceanOrder.objects.filter(order_id=order_id).update(status="FAILED")

        return JsonResponse({"status": "success"})

    except Exception as e:
        print("❌ Webhook error:", e)
        return JsonResponse({"error": str(e)}, status=500)
    
class UserPaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PaymentHistory.objects.filter(user=self.request.user).order_by("-created_at")

from django.http import FileResponse, Http404
from django.contrib.auth.decorators import login_required
from .models import OceanInvoice

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_invoice(request, invoice_id):
    try:
        # Ensure invoice belongs to the logged-in user
        invoice = OceanInvoice.objects.get(id=invoice_id, user=request.user)
    except OceanInvoice.DoesNotExist:
        raise Http404("Invoice not found for this user.")

    # Check if PDF exists before serving
    if not invoice.pdf_file or not invoice.pdf_file.name:
        raise Http404("Invoice PDF not available. Please contact support.")

    # Return the file as downloadable attachment
    return FileResponse(
        invoice.pdf_file.open('rb'),
        as_attachment=True,
        filename=f"OceanInvoice_{invoice.invoice_number or invoice.id}.pdf",
        content_type="application/pdf"
    )

# api to get payment analytics for logged in user 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_analytics_user(request):
     user = request.user
     total_spent = PaymentHistory.objects.filter(user=user, status="success").aggregate(total=Sum("amount"))["total"] or 0
     total_payments = PaymentHistory.objects.filter(user=user).count()
     per_method = PaymentHistory.objects.filter(user=user, status="success").values("method").annotate(count=Count("id"), sum=Sum("amount"))
     return JsonResponse({
        "total_spent": float(total_spent),
        "total_payments": total_payments,
        "per_method": list(per_method)
    })