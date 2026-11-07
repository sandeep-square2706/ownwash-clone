from django.db import migrations


def add_cobweb_cleaning(apps, schema_editor):
    Category = apps.get_model("services", "Category")
    Service = apps.get_model("services", "Service")
    database = schema_editor.connection.alias

    category, _ = Category.objects.using(database).get_or_create(
        slug="home-cleaning",
        defaults={
            "name": "Home Cleaning",
            "is_active": True,
        },
    )
    Service.objects.using(database).get_or_create(
        slug="cobweb-cleaning",
        defaults={
            "category": category,
            "name": "Cobweb Cleaning",
            "short_description": "High-reach cobweb and corner dusting.",
            "description": (
                "Careful high-reach dusting to remove cobwebs from ceilings, "
                "corners and other hard-to-reach areas."
            ),
            "price": 299,
            "duration_minutes": 60,
            "features": [
                "Ceiling and corner cobweb removal",
                "High-reach dusting",
                "Tidy clean-up after service",
            ],
            "is_active": True,
            "is_top_service": False,
            "display_order": 14,
        },
    )


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0002_service_addons_service_features"),
    ]

    operations = [
        migrations.RunPython(add_cobweb_cleaning, migrations.RunPython.noop),
    ]
