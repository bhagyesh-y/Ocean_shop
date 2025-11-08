from rest_framework import serializers
from .models import PaymentHistory


class PaymentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentHistory
        fields = "__all__"
    
    def get_invoice_id(self, obj):
        inv = getattr(obj, "invoice", None)
        invoice = obj.order.invoices.first()
        return invoice.id if invoice else None    