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

            # ✅ Ensure user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

            # ✅ Create Razorpay order
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            payment = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1
            })

            # ✅ Create order in DB (linked to user)
            order = OceanOrder.objects.create(
                user=user,
                order_id=payment["id"],
                amount=float(data["amount"]),
                is_paid=False
            )

            # ✅ Return order details for frontend checkout
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
    ✅ Verify payment securely.
    Checks if the order belongs to the user who created it.
    Updates order status after successful verification.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")

            if not user_id:
                return JsonResponse({"error": "user_id is required"}, status=400)

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            # ✅ Step 1: Verify Razorpay signature
            client.utility.verify_payment_signature({
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_signature": data["razorpay_signature"],
            })

            # ✅ Step 2: Fetch payment info
            payment_info = client.payment.fetch(data["razorpay_payment_id"])

            # ✅ Step 3: Find order that belongs to the same user
            order = OceanOrder.objects.get(order_id=data["razorpay_order_id"], user=user)
            order.is_paid = True
            order.payment_id = data["razorpay_payment_id"]
            order.status = payment_info.get("status", "paid")
            order.method = payment_info.get("method")
            order.email = payment_info.get("email")
            order.contact = payment_info.get("contact")
            order.currency = payment_info.get("currency", "INR")
            order.save()

            print(f"✅ Payment verified for user {user.username}, order {order.order_id}")
            return JsonResponse({"status": "Payment Successful"})

        except OceanOrder.DoesNotExist:
            return JsonResponse({"status": "Order not found for this user"}, status=403)
        except razorpay.errors.SignatureVerificationError:
            return JsonResponse({"status": "Signature verification failed"}, status=400)
        except Exception as e:
            print("❌ Payment verification error:", e)
            return JsonResponse({"status": "Payment Verification Failed", "error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)
