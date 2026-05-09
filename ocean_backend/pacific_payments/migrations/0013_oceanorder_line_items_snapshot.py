from django.db import migrations, models


def empty_line_items():
    return []


class Migration(migrations.Migration):

    dependencies = [
        ("pacific_payments", "0012_paymenthistory_invoice_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="oceanorder",
            name="line_items_snapshot",
            field=models.JSONField(blank=True, default=empty_line_items),
        ),
    ]
