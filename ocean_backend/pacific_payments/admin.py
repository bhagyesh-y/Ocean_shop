from django.contrib import admin
from .models import OceanOrder, RazorpayWebhookLog, PaymentHistory, OceanInvoice, Coupon
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.utils import timezone


class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'is_staff', 'is_active', 'date_joined')
    ordering = ('id',)
    
    
@admin.register(OceanOrder)
class OceanOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "order_id", "user", "amount", "is_paid", "status", "created_at")
    list_filter = ("is_paid", "status")
    search_fields = ("order_id", "payment_id", "user__username", "email")


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(RazorpayWebhookLog)
class RazorpayWebhookLogAdmin(admin.ModelAdmin):
    list_display = ("event", "formatted_received_time", "short_payload")
    list_filter = ("event",)
    ordering = ("-received_at",)

    def formatted_received_time(self, obj):
        local_time = timezone.localtime(obj.received_at)
        return local_time.strftime("%d %b %Y — %I:%M %p IST")
    formatted_received_time.short_description = "Received At"

    def short_payload(self, obj):
        # show only a preview of payload
        data = str(obj.payload)
        return data[:80] + "..." if len(data) > 80 else data
    short_payload.short_description = "Payload"

@admin.register(PaymentHistory)
class PaymentHistoryAdmin(admin.ModelAdmin):
      list_display = ("id", "user", "order_id", "payment_id", "amount", "status", "created_at")
      search_fields = ("order_id", "payment_id", "user__email")
   
@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ("code", "discount_percent", "discount_amount", "is_active", "used_count", "valid_until")
    search_fields = ("code",)


@admin.register(OceanInvoice)
class OceanInvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "user", "order", "invoice_date", "issue_date")
    readonly_fields = ("invoice_number", "issue_date", "due_date", "pdf_url")
    search_fields = ("invoice_number", "order__order_id", "user__username")


