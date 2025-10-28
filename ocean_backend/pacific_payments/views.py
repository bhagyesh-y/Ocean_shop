from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import OceanOrder
import razorpay
import json

@csrf_exempt
def create_order(request):
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

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            payment = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1
            })

            # ✅ Create order in database
            order = OceanOrder.objects.create(
                user=user,
                order_id=payment['id'],
                amount=data['amount']
            )

            return JsonResponse({
                "order_id": payment['id'],
                "key": settings.RAZORPAY_KEY_ID,
                "amount": data['amount'],
                "currency": "INR"
            })
        
        except Exception as e:
            print("❌ Error creating Razorpay order:", e)
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def verify_payment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            client.utility.verify_payment_signature({
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature']
            })

            order = OceanOrder.objects.get(order_id=data['razorpay_order_id'])
            order.is_paid = True
            order.payment_id = data['razorpay_payment_id']
            order.save()

            return JsonResponse({"status": "Payment Successful"})
        except Exception as e:
            print("❌ Payment verification error:", e)
            return JsonResponse({"status": "Payment Verification Failed", "error": str(e)}, status=400)
    
    return JsonResponse({"error": "Invalid request"}, status=400)
