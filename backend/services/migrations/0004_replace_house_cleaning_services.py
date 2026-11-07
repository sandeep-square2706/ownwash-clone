from django.db import migrations


HOME_SERVICES = [
    {
        "name": "Floor Cleaning",
        "slug": "floor-cleaning",
        "description": (
            "Professional floor cleaning for apartments and homes, with a plan "
            "matched to your floor area."
        ),
        "price": 399,
        "max_price": 899,
        "duration_minutes": 60,
        "features": [
            "Dust and dirt removal",
            "Mopping with professional cleaner",
            "Safe care for common floor types",
        ],
        "display_order": 8,
        "variants": [
            ("1 BHK · up to 600 sq. ft.", 399),
            ("2 BHK · up to 1,000 sq. ft.", 549),
            ("3 BHK · up to 1,500 sq. ft.", 699),
            ("4 BHK · up to 2,000 sq. ft.", 899),
        ],
    },
    {
        "name": "Dishwashing & Utensils Cleaning",
        "slug": "dishwashing-utensils-cleaning",
        "description": (
            "Convenient cleaning for used dishes, cookware and kitchen utensils, "
            "with hygienic rinsing and neat arrangement."
        ),
        "price": 99,
        "max_price": 299,
        "duration_minutes": 45,
        "features": [
            "Washing plates, bowls, glasses and cookware",
            "Removal of grease and food residue",
            "Rinsing and arranging utensils neatly",
            "Safe, food-grade cleaning products",
            "Extra utensils above 30: ₹10 each",
        ],
        "display_order": 9,
        "variants": [
            ("Small · up to 10 utensils", 99),
            ("Medium · up to 20 utensils", 199),
            ("Large · up to 30 utensils", 299),
        ],
    },
]

GARBAGE_SERVICE = {
    "name": "Doorstep Garbage Collection",
    "slug": "doorstep-garbage-collection",
    "description": (
        "Scheduled doorstep pickup for household waste, with flexible one-time "
        "and recurring collection plans."
    ),
    "price": 49,
    "max_price": 399,
    "duration_minutes": 30,
    "features": [
        "Convenient doorstep pickup",
        "Separate wet and dry waste",
        "Responsible waste collection",
        "Choose one-time or recurring collection",
    ],
    "display_order": 10,
    "variants": [
        ("One-time pickup", 49),
        ("Weekly collection · per month", 149),
        ("Alternate-day collection · per month", 249),
        ("Daily collection · per month", 399),
    ],
}


def replace_house_cleaning(apps, schema_editor):
    Category = apps.get_model("services", "Category")
    Service = apps.get_model("services", "Service")
    ServiceVariant = apps.get_model("services", "ServiceVariant")
    database = schema_editor.connection.alias

    Service.objects.using(database).filter(slug="house-cleaning").update(is_active=False)

    categories = {
        "home-cleaning": "Home Cleaning",
        "home-services": "Home Services",
    }

    for slug, name in categories.items():
        category, _ = Category.objects.using(database).get_or_create(
            slug=slug,
            defaults={"name": name, "is_active": True},
        )
        service_data = HOME_SERVICES if slug == "home-cleaning" else [GARBAGE_SERVICE]
        for data in service_data:
            service, _ = Service.objects.using(database).get_or_create(
                slug=data["slug"],
                defaults={
                    "category": category,
                    "name": data["name"],
                    "description": data["description"],
                    "price": data["price"],
                    "max_price": data["max_price"],
                    "duration_minutes": data["duration_minutes"],
                    "features": data["features"],
                    "is_active": True,
                    "is_top_service": False,
                    "display_order": data["display_order"],
                },
            )
            for index, (variant_name, price) in enumerate(data["variants"]):
                ServiceVariant.objects.using(database).get_or_create(
                    service=service,
                    name=variant_name,
                    defaults={
                        "price": price,
                        "is_active": True,
                        "display_order": index,
                    },
                )

    display_order_by_slug = {
        "ac-services": 11,
        "water-tank-cleaning": 12,
        "kitchen-cleaning": 13,
        "carpet-cleaning": 14,
        "sofa-dry-cleaning": 15,
        "cobweb-cleaning": 16,
    }
    for slug, display_order in display_order_by_slug.items():
        Service.objects.using(database).filter(slug=slug).update(display_order=display_order)


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0003_add_cobweb_cleaning"),
    ]

    operations = [
        migrations.RunPython(replace_house_cleaning, migrations.RunPython.noop),
    ]
