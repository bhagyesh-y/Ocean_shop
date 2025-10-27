from django.shortcuts import render

import razorpay
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import OceanOrder

@csrf_exempt
def create_order(request):
    if request.method == "POST":
        import json
        data = json.loads(request.body)
        amount = int(float(data['amount']) * 100)  # convert to paise
        user_id = data.get('user_id')

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        payment = client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1
        })

        order = OceanOrder.objects.create(
            user_id=user_id,
            order_id=payment['id'],
            amount=data['amount']
        )

        return JsonResponse({"order_id": payment['id'], "key": settings.RAZORPAY_KEY_ID})
    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def verify_payment(request):
    if request.method == "POST":
        import json
        data = json.loads(request.body)
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        try:
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
        except:
            return JsonResponse({"status": "Payment Verification Failed"}, status=400)

