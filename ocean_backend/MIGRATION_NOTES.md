# Database migrations (run manually)

After pulling these changes, from `ocean_backend/`:

```bash
python manage.py makemigrations pacific_products pacific_payments
python manage.py migrate
```

## New models

**pacific_products**
- `Wishlist` — user + product (unique together)
- `ProductReview` — user + product + rating + comment (unique together)

**pacific_payments**
- `Coupon` — discount codes for checkout
- `OceanOrder` — new fields: `coupon_code`, `discount_amount`

## Seed a test coupon (Django admin or shell)

```python
from pacific_payments.models import Coupon
Coupon.objects.create(code="OCEAN10", discount_percent=10, min_order_amount=0, is_active=True)
```

## Environment (password reset email)

Set on Render / `.env`:

- `FRONTEND_URL=https://ocean-shop-one.vercel.app`
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD` (or use console backend in dev)

Without email config, reset links are sent via `send_mail` with `fail_silently=True` — use Django admin or logs in development.
