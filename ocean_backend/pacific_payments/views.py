import json
import hmac
import hashlib
import os
import logging
from decimal import Decimal, ROUND_HALF_UP

import razorpay
from django.conf import settings
from django.http import Http404, HttpResponseRedirect, JsonResponse
from django.db.models import Sum, Count
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import OceanOrder, RazorpayWebhookLog, PaymentHistory, OceanInvoice
from .serializers import PaymentHistorySerializer
from .utils import save_and_email_invoice
from pacific_products.models import OceanCart

logger = logging.getLogger(__name__)


def _client_error_message(exc, generic="Request could not be processed."):
    if settings.DEBUG:
        return str(exc)
    return generic


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    Create a Razorpay order for the authenticated user.
    Amount is taken from the server-side cart (client amount is validated only).
    """
    user = request.user
    try:
        data = request.data
        amount_client = Decimal(str(data.get("amount", "0")))

        cart_items = list(
            OceanCart.objects.filter(user=user).select_related("product")
        )
        if not cart_items:
            return Response(
                {"error": "Cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        server_total = Decimal("0")
        line_items_snapshot = []
        for item in cart_items:
            price = Decimal(str(item.product.price))
            qty = int(item.quantity)
            line_total = price * qty
            server_total += line_total
            line_items_snapshot.append(
                {
                    "product_id": item.product_id,
                    "name": item.product.name,
                    "price": str(price),
                    "qty": qty,
                    "subtotal": str(line_total),
                }
            )

        if abs(server_total - amount_client) > Decimal("0.05"):
            return Response(
                {"error": "Amount does not match your cart. Refresh and try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        amount_paise = int(
            (server_total * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        )

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        payment = client.order.create(
            {
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": 1,
            }
        )

        order = OceanOrder.objects.create(
            user=user,
            order_id=payment["id"],
            amount=float(server_total),
            is_paid=False,
            line_items_snapshot=line_items_snapshot,
        )

        return Response(
            {
                "order_id": payment["id"],
                "key": settings.RAZORPAY_KEY_ID,
                "amount": float(server_total),
                "currency": "INR",
            }
        )

    except Exception as e:
        logger.exception("create_order failed")
        return Response(
            {"error": _client_error_message(e, "Could not create payment order.")},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    user = request.user
    try:
        data = request.data

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_signature": data["razorpay_signature"],
            }
        )

        order = OceanOrder.objects.get(
            order_id=data["razorpay_order_id"],
            user=user,
        )
        order.is_paid = True
        order.payment_id = data["razorpay_payment_id"]
        order.status = "paid"
        order.method = "razorpay"
        order.currency = "INR"
        order.save()

        OceanCart.objects.filter(user=user).delete()

        payment_history = PaymentHistory.objects.create(
            user=user,
            order_id=order.order_id,
            payment_id=order.payment_id,
            amount=Decimal(str(order.amount)),
            method="razorpay",
            status="success",
        )

        try:
            save_and_email_invoice(order, user, payment=payment_history)
        except Exception as invoice_error:
            logger.exception("Invoice generation failed after payment")

        return Response({"status": "Payment Successful"})

    except razorpay.errors.SignatureVerificationError:
        return Response(
            {
                "status": "Payment Verification Failed",
                "error": "Invalid payment signature",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    except OceanOrder.DoesNotExist:
        return Response(
            {
                "status": "Payment Verification Failed",
                "error": "Order not found",
            },
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        logger.exception("verify_payment failed")
        return Response(
            {
                "status": "Payment Verification Failed",
                "error": _client_error_message(
                    e, "Payment verification failed. Contact support if you were charged."
                ),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@csrf_exempt
def razorpay_webhook(request):
    """Razorpay server-to-server webhook (no JWT; verified by HMAC signature)."""
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=400)

    try:
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
        if not webhook_secret:
            logger.error("RAZORPAY_WEBHOOK_SECRET is not configured")
            return JsonResponse({"error": "Webhook not configured"}, status=503)

        received_signature = request.headers.get("X-Razorpay-Signature") or ""
        body = request.body.decode()

        generated_signature = hmac.new(
            webhook_secret.encode(), body.encode(), hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(received_signature, generated_signature):
            return JsonResponse({"error": "Invalid signature"}, status=400)

        data = json.loads(body)
        RazorpayWebhookLog.objects.create(event=data.get("event"), payload=data)

        event = data.get("event")
        if event == "payment.captured":
            order_id = data["payload"]["payment"]["entity"]["order_id"]
            OceanOrder.objects.filter(order_id=order_id).update(status="PAID")
        elif event == "payment.failed":
            order_id = data["payload"]["payment"]["entity"]["order_id"]
            OceanOrder.objects.filter(order_id=order_id).update(status="FAILED")

        return JsonResponse({"status": "success"})

    except Exception as e:
        logger.exception("Webhook error")
        return JsonResponse(
            {"error": _client_error_message(e, "Webhook processing failed.")},
            status=500,
        )


class UserPaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PaymentHistory.objects.filter(user=self.request.user).order_by(
            "-created_at"
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_invoice(request, invoice_id):
    try:
        invoice = OceanInvoice.objects.get(id=invoice_id, user=request.user)
    except OceanInvoice.DoesNotExist:
        raise Http404("Invoice not found for this user.")

    if invoice.pdf_url:
        return HttpResponseRedirect(invoice.pdf_url)

    if invoice.pdf_file:
        file_path = invoice.pdf_file.path
        if os.path.exists(file_path):
            from django.http import FileResponse

            filename = os.path.basename(file_path)
            response = FileResponse(open(file_path, "rb"), content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename="{filename}"'
            return response

    raise Http404("Invoice PDF not available.")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payment_analytics_user(request):
    user = request.user
    total_spent = (
        PaymentHistory.objects.filter(user=user, status="success").aggregate(
            total=Sum("amount")
        )["total"]
        or 0
    )
    total_payments = PaymentHistory.objects.filter(user=user).count()
    per_method = (
        PaymentHistory.objects.filter(user=user, status="success")
        .values("method")
        .annotate(count=Count("id"), sum=Sum("amount"))
    )
    return JsonResponse(
        {
            "total_spent": float(total_spent),
            "total_payments": total_payments,
            "per_method": list(per_method),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_payments(request):
    payments = PaymentHistory.objects.filter(user=request.user).order_by(
        "-created_at"
    )[:5]
    serializer = PaymentHistorySerializer(payments, many=True)
    return Response(serializer.data)
