from django.urls import path
from . import views

urlpatterns = [
    path('create-order/', views.create_order, name='create_order'),
    path('verify-payment/', views.verify_payment, name='verify_payment'),
    path('webhook/', views.razorpay_webhook, name = 'razorpay_webhook'),
    path("history/",views.UserPaymentHistoryView.as_view(),name="payment_history")
]
