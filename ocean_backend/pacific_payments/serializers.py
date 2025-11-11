from rest_framework import serializers
from .models import PaymentHistory
from .models import OceanInvoice

class PaymentHistorySerializer(serializers.ModelSerializer):
    invoice_id = serializers.SerializerMethodField()

    class Meta:
        model = PaymentHistory
        fields = [
            "id",
            "user",
            "order_id",
            "payment_id",
            "amount",
            "method",
            "status",
            "created_at",
            "invoice_id",
        ]

    def get_invoice_id(self, obj):
        # Ensure robust lookup by both 'payment' and 'order'
        invoice = OceanInvoice.objects.filter(payment=obj).first()
        if not invoice:
            invoice = OceanInvoice.objects.filter(order__order_id=obj.order_id, user=obj.user).first()
        return invoice.id if invoice else None