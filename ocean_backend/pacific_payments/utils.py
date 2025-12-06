import os
from io import BytesIO
from datetime import timedelta
from django.utils import timezone
from django.core.files.base import ContentFile
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.conf import settings
from pacific_products.models import OceanCart
from .models import OceanInvoice
import base64
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail,Attachment,FileContent,FileName,FileType,Disposition


# Generating the PDF
def generate_invoice_pdf(order, user, payment=None):
    """Generate a proper invoice PDF using an HTML template"""
    template_path = "invoice_template.html"
    context = {
        "user": user,
        "order": order,
        "payment": payment,
        "date": timezone.now(),
        "company_name": "OceanCart",
        "company_email": "support@oceancart.com",
        "company_address": "123 Ocean Street, Coral Bay, Earth 🌊",
        "company_logo": "https://i.ibb.co/dg3tXxP/ocean-logo.png",
    }

    try:
        if hasattr(order, "products"):
            items = order.products.all()
        elif hasattr(order, "cart_items"):
            items = order.cart_items.all()
        else:
            items = OceanCart.objects.filter(user=user)
    except Exception as e:
        print("⚠️ Could not fetch items for invoice:", e)
        items = []

  
    final_items = []
    total_amount = 0

    for item in items:
        try:
            name = getattr(item.product, "name", getattr(item, "name", "Unknown"))
            price = float(getattr(item.product, "price", getattr(item, "price", 0)))
            qty = int(getattr(item, "quantity", 1))

            subtotal = price * qty
            total_amount += subtotal

            final_items.append({
                "name": name,
                "qty": qty,
                "price": price,
                "subtotal": subtotal,
            })

        except Exception as e:
            print("⚠️ Error processing item:", e)

    # Add final computed items + total
    context["items"] = final_items
    context["total"] = total_amount

    # Render PDF
    template = get_template(template_path)
    html = template.render(context)

    result = BytesIO()
    pisa_status = pisa.CreatePDF(html, dest=result)

    if pisa_status.err:
        print("❌ Error creating PDF:", pisa_status.err)

    return result.getvalue()

# Save invoice locally + Email + Update database
def save_and_email_invoice(order, user, payment=None, recipient_email=None):
    """
    Generates the invoice PDF, saves the invoice record,
    and emails the PDF to the specified recipient.
    """
    try:
        print(" Generating PDF...")
        pdf_bytes = generate_invoice_pdf(order, user, payment)
        print(f" PDF generated: {len(pdf_bytes)} bytes")

        # Resolve recipient email
        final_recipient_email = recipient_email if recipient_email else user.email
        
        if not final_recipient_email:
            print("❌ Cannot send invoice: No email found.")
            final_recipient_email = user.email  # fallback

        # Save PDF file locally
        filename = f"invoice_{order.order_id}.pdf"
        relative_path = f"invoices/{filename}"
        full_path = os.path.join(settings.MEDIA_ROOT, relative_path)

        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        with open(full_path, "wb") as f:
            f.write(pdf_bytes)

        pdf_url = settings.MEDIA_URL + relative_path

        # ⭐ Save invoice to DB
        print("💾 Step 3: Saving invoice to database...")
        invoice, created = OceanInvoice.objects.get_or_create(
            order=order,
            defaults={
                "user": user,
                "payment": payment,
                "invoice_number": f"INV-{user.id}-{int(timezone.now().timestamp())}",
                "issue_date": timezone.now(),
                "due_date": timezone.now() + timedelta(days=7),
                "pdf_url": pdf_url,
            }
        )
        print(f"✅ Invoice {'created' if created else 'already exists'}: {invoice.invoice_number}")

        # ⭐ SEND EMAIL VIA SENDGRID ⭐
        try:
            print(f"DEBUG: Sending invoice via SendGrid to {final_recipient_email}")

            # Prepare PDF attachment (base64)
            encoded_pdf = base64.b64encode(pdf_bytes).decode()
            attachment = Attachment(
                FileContent(encoded_pdf),
                FileName(f"invoice_{order.order_id}.pdf"),
                FileType("application/pdf"),
                Disposition("attachment")
            )

            # Compose message
            message = Mail(
                from_email=os.environ.get("FROM_EMAIL"),
                to_emails=final_recipient_email,
                subject=f"Invoice for Order {order.order_id}",
                html_content=f"""
                    <p>Hello {user.first_name or user.username},</p>
                    <p>Thank you for your purchase! Your invoice is attached below.</p>
                    <p><strong>Order ID:</strong> {order.order_id}</p>
                    <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
                    <p>Warm Regards,<br>OceanCart Team 🌊</p>
                """
            )

            # Attach PDF
            message.attachment = attachment

            # Send via SendGrid
            sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
            response = sg.send(message)
            print("📤 SendGrid Email Sent:", response.status_code)

        except Exception as e:
            print(f"❌ SendGrid Error sending invoice to {final_recipient_email}: {e}")

        print("✅ save_and_email_invoice completed successfully")
        return invoice

    except Exception as e:
        print(f"❌ Error in save_and_email_invoice: {e}")
        import traceback
        traceback.print_exc()
        raise
