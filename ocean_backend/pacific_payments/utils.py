import json
from io import BytesIO
from datetime import timedelta
from django.utils import timezone
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.conf import settings
from pacific_products.models import OceanCart
from .models import OceanInvoice


def generate_invoice_pdf(order, user, payment=None):
    """Generate a proper invoice PDF using an HTML template"""
    template_path = "invoice_template.html"
    context = {
        "user": user,
        "order": order,
        "payment": payment,
        "date": timezone.now(),
        "company_name": "OceanCart",
        "company_email": "support@oceancart.example",
        "company_address": "123 Ocean Street, Coral Bay, Earth 🌊",
        "company_logo": "https://i.ibb.co/dg3tXxP/ocean-logo.png",
    }

    # ✅ Ensure order.products exists (if it doesn’t, handle it)
    try:
        if hasattr(order, "products"):
            context["items"] = order.products.all()
        elif hasattr(order, "cart_items"):
            context["items"] = order.cart_items.all()
        else:
            context["items"] = OceanCart.objects.filter(user=user)
    except Exception as e:
        print("⚠️ Could not fetch items for invoice:", e)
        context["items"] = []

    # ✅ Render HTML template into PDF
    template = get_template(template_path)
    html = template.render(context)

    result = BytesIO()
    pisa_status = pisa.CreatePDF(html, dest=result)

    if pisa_status.err:
        print("❌ Error creating PDF:", pisa_status.err)

    return result.getvalue()


def save_and_email_invoice(order, user, payment=None):
    """Generate, store, and email an invoice PDF"""
    pdf_bytes = generate_invoice_pdf(order, user, payment)
    filename = f"{settings.INVOICE_FILENAME_PREFIX}{order.order_id}.pdf"

    # ✅ Create or reuse existing invoice safely
    invoice, created = OceanInvoice.objects.get_or_create(
        payment=payment,
        defaults={
            "user": user,
            "order": order,
            "invoice_number": f"INV-{user.id}-{int(timezone.now().timestamp())}",
            "issue_date": timezone.now(),
            "due_date": timezone.now() + timedelta(days=7),
        },
    )

    # ✅ Save PDF file (update if regenerated)
    invoice.pdf_file.save(filename, ContentFile(pdf_bytes), save=True)

    # ✅ Always send invoice email on payment success
    if created or payment:
        if not user.email:
            print("⚠️ User has no email — skipping invoice send.")
            return invoice

        subject = f"Invoice for Order {order.order_id}"
        body = (
            f"Hello {user.first_name or user.username},\n\n"
            f"Thank you for your purchase! Your payment has been received successfully.\n"
            f"Please find your invoice attached.\n\n"
            f"Best regards,\nOceanCart 🌊"
        )

        email = EmailMessage(
            subject,
            body,
            f"OceanCart <{settings.EMAIL_HOST_USER}>",
            [user.email],
        )
        email.attach(filename, pdf_bytes, "application/pdf")
        email.send(fail_silently=False)

    return invoice
