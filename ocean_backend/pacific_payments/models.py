from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class OceanOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ocean_orders")
    order_id = models.CharField(max_length=100, unique=True)
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.FloatField()
    currency = models.CharField(max_length=10, default="INR")
    status = models.CharField(max_length=20, default="created")  # created, paid, failed
    method = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    contact = models.CharField(max_length=20, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_id} by {self.user.username}"
    
class RazorpayWebhookLog(models.Model):
    event = models.CharField(max_length=100)
    payload = models.JSONField()
    received_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        # Format time in local timezone (Asia/Kolkata)
        local_time = timezone.localtime(self.received_at)
        formatted_time = local_time.strftime("%d %b %Y — %I:%M %p IST")
        return f"{self.event} at {formatted_time}"
  

class PaymentHistory(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    order_id = models.CharField(max_length=100)
    payment_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} — ₹{self.amount} ({self.status})"
    