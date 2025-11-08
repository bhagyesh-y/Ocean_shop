import json
from django.template.loader import render_to_string
from io import BytesIO
from xhtml2pdf import pisa
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage
from django.conf import settings
from .models import OceanInvoice



def generate_invoice_pdf(order, user, payment=None):
    """
    Renders HTML template to PDF and returns bytes.
    """
    # prepare items for template - adapt according to your OceanOrder model
    items = []
    if hasattr(order, "items_data"):  # example attribute
        items = order.items_data
    # fallback: single-line summary
    context = {
        "user": user,
        "order": order,
        "payment": payment,
        "items": items,
    }
    html = render_to_string("invoice_template.html", context)
    result = BytesIO()
    pisa_status = pisa.CreatePDF(src=html, dest=result)
    if pisa_status.err:
        raise Exception("Error generating PDF")
    return result.getvalue()

def save_and_email_invoice(order, user, payment=None):
    pdf_bytes = generate_invoice_pdf(order, user, payment)
    filename = f"{settings.INVOICE_FILENAME_PREFIX}{order.order_id}.pdf"
    # save to model
 
    invoice = OceanInvoice.objects.create(user=user, order=order, payment=payment)
    invoice.pdf_file.save(filename, ContentFile(pdf_bytes))
    invoice.save()

    # email
    subject = f"Invoice for Order {order.order_id}"
    body = "Thank you for your purchase. Please find attached invoice."
    email = EmailMessage(subject, body, settings.EMAIL_HOST_USER, [user.email])
    email.attach(filename, pdf_bytes, "application/pdf")
    email.send(fail_silently=False)
    return invoice
