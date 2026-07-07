from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


def _empty_line_items():
    return []


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
    # Snapshot of cart line items at checkout (for invoices / audits)
    line_items_snapshot = models.JSONField(default=_empty_line_items, blank=True)
    coupon_code = models.CharField(max_length=50, blank=True, null=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Order {self.order_id} by {self.user.username}"


class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_percent = models.PositiveSmallIntegerField(
        default=0, help_text="Percentage off (0–100). Use this OR discount_amount."
    )
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, help_text="Flat ₹ off. Used when discount_percent is 0."
    )
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_uses = models.PositiveIntegerField(default=0, help_text="0 = unlimited")
    used_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    valid_until = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

    def is_valid(self):
        from django.utils import timezone

        if not self.is_active:
            return False
        if self.valid_until and timezone.now() > self.valid_until:
            return False
        if self.max_uses and self.used_count >= self.max_uses:
            return False
        return True

    def calculate_discount(self, subtotal):
        from decimal import Decimal

        subtotal = Decimal(str(subtotal))
        if subtotal < self.min_order_amount:
            return Decimal("0")
        if self.discount_percent:
            return (subtotal * Decimal(self.discount_percent) / Decimal("100")).quantize(
                Decimal("0.01")
            )
        return min(Decimal(str(self.discount_amount)), subtotal)
    
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
    invoice_id=models.CharField(max_length=100,blank=True,null=True)
    payment_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    invoice_url = models.URLField(null=True,blank=True)

    def __str__(self):
        return f"{self.user.username} — ₹{self.amount} ({self.status})"
    
class OceanInvoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ForeignKey(
        'OceanOrder',
        on_delete=models.CASCADE,
        related_name='invoices'
    )
    invoice_number = models.CharField(max_length=100, unique=True)
    invoice_date = models.DateField(auto_now_add=True)
    issue_date = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField(blank=True, null=True)
    
    payment = models.ForeignKey(
        PaymentHistory,
        on_delete=models.CASCADE,
        related_name='invoices',
    )

    #  invoice upload to media folder 
    pdf_file = models.FileField(
        upload_to="invoices/",
        blank=True,
        null=True
    )
    pdf_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Invoice {self.pk} for {self.order.order_id} - ₹{self.order.amount}"