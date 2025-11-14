from rest_framework import serializers
from .models import PaymentHistory, OceanInvoice

class PaymentHistorySerializer(serializers.ModelSerializer):
    invoice_id = serializers.SerializerMethodField()
    invoice_url = serializers.SerializerMethodField() 

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
            "invoice_url",
        ]

    def get_invoice_id(self, obj):
        invoice = OceanInvoice.objects.filter(payment=obj).first()
        if not invoice:
            invoice = OceanInvoice.objects.filter(
                order__order_id=obj.order_id,
                user=obj.user
            ).first()
        return invoice.id if invoice else None

    def get_invoice_url(self, obj):
        invoice = OceanInvoice.objects.filter(payment=obj).first()
        if not invoice:
            invoice = OceanInvoice.objects.filter(
                order__order_id=obj.order_id,
                user=obj.user
            ).first()
        return invoice.pdf_url if invoice else None
