from django.contrib import admin
from .models import OceanOrder



from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

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
