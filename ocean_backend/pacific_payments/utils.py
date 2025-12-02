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
import cloudinary.uploader


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

    # -----------------------------
    # Render PDF
    # -----------------------------
    template = get_template(template_path)
    html = template.render(context)

    result = BytesIO()
    pisa_status = pisa.CreatePDF(html, dest=result)

    if pisa_status.err:
        print("❌ Error creating PDF:", pisa_status.err)

    return result.getvalue()


# def save_and_email_invoice(order, user, payment=None):
#     pdf_bytes = generate_invoice_pdf(order, user, payment)

#     # ⭐ Upload as RAW file to Cloudinary
#     upload_result = cloudinary.uploader.upload(
#         pdf_bytes,
#         resource_type="raw",
#         folder="ocean/invoices",
#         public_id=f"invoice_{order.order_id}"
#     )

#     pdf_url = upload_result["secure_url"]

#     # ⭐ Save invoice (ONLY URL stored)
#     invoice, created = OceanInvoice.objects.get_or_create(
#         payment=payment,
#         defaults={
#             "user": user,
#             "order": order,
#             "invoice_number": f"INV-{user.id}-{int(timezone.now().timestamp())}",
#             "issue_date": timezone.now(),
#             "due_date": timezone.now() + timedelta(days=7),
#             "pdf_url": pdf_url,
#         }
#     )

#     # ⭐ Send email only once
#     if created:
#         print(f"DEBUG: Attempting to send invoice to email: {user.email}") # for testing the currect user 
#         email = EmailMessage(
#             subject=f"Invoice for Order {order.order_id}",
#             body=(
#                 f"Hello {user.first_name or user.username},\n\n"
#                 f"Thank you for your purchase! Attached is your invoice.\n\n"
#                 f"Regards,\nOceanCart 🌊"
#             ),
#             from_email=settings.EMAIL_HOST_USER,
#             to=[user.email],
#         )
#         email.attach(f"invoice_{order.order_id}.pdf", pdf_bytes, "application/pdf")
#         email.send(fail_silently=False)

#     return invoice

def save_and_email_invoice(order, user, payment=None, recipient_email=None):
    """
    Generates the invoice PDF, uploads it, saves the invoice record,
    and emails the PDF to the specified recipient.
    """
    try:
        print("📝 Step 1: Generating PDF...")
        pdf_bytes = generate_invoice_pdf(order, user, payment)
        print(f"✅ PDF generated: {len(pdf_bytes)} bytes")

    # Resolve the email to send the invoice to
        final_recipient_email = recipient_email if recipient_email else user.email
    
        if not final_recipient_email:
            print("❌ Cannot send invoice: No recipient email found in user object or recipient_email argument.")
        # Proceed with saving the invoice URL, but skip the email
            final_recipient_email = user.email # Use this for logging/DB if needed

    # ⭐ Upload as RAW file to Cloudinary
        print(" Step 2:Uploading pdf to cloudinary...")
        upload_result = cloudinary.uploader.upload(
        pdf_bytes,
        resource_type="raw",
        folder="ocean/invoices",
        public_id=f"invoice_{order.order_id}"
        )

        pdf_url = upload_result["secure_url"]
        print(f"✅ Uploaded to Cloudinary: {pdf_url}")

         # ⭐ Save invoice (ONLY URL stored)
        print("💾 Step 3: Saving invoice to database...")
        invoice, created = OceanInvoice.objects.get_or_create(
            order=order,
            defaults={
                 "user": user,
                 "payment":payment,
                 "invoice_number": f"INV-{user.id}-{int(timezone.now().timestamp())}",
                 "issue_date": timezone.now(),
                 "due_date": timezone.now() + timedelta(days=7),
                 "pdf_url": pdf_url,
            }
        
        )
        print(f"✅ Invoice {'created' if created else 'already exists'}: {invoice.invoice_number}")

      # ⭐ Send email only once
        if created and final_recipient_email:
            print(f"DEBUG: Attempting to send invoice to email:  {final_recipient_email} (User ID: {user.id})") 
            email = EmailMessage(
                 subject=f"Invoice for Order {order.order_id}",
                 body=(
                     f"Hello {user.first_name or user.username},\n\n"
                     f"Thank you for your purchase! Attached is your invoice.\n\n"
                     f"Regards,\nOceanCart 🌊"
                 ),
                 from_email=settings.EMAIL_HOST_USER,
                 to=[final_recipient_email], # <--- USING THE RESOLVED EMAIL
            )
            email.attach(f"invoice_{order.order_id}.pdf", pdf_bytes, "application/pdf")
        
            try:
               email.send(fail_silently=False)
               print("✅ Invoice email sent successfully.")
            except Exception as e:
               print(f"❌ Error sending invoice email to {final_recipient_email}: {e}")
        print("✅ save_and_email_invoice completed successfully")
        return invoice
    except Exception as e:
        print(f"❌ Error in save_and_email_invoice: {e}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise