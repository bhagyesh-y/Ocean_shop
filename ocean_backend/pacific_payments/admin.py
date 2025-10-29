from django.contrib import admin
from .models import OceanOrder


@admin.register(OceanOrder)
class OceanOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "order_id", "user", "amount", "is_paid", "status", "created_at")
    list_filter = ("is_paid", "status")
    search_fields = ("order_id", "payment_id", "user__username", "email")
# Register your models here.
