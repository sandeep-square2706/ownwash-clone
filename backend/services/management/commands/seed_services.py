from django.core.management.base import BaseCommand
from services.models import Category, Service, ServiceVariant


SERVICES = [
    ("Car Cleaning", "Foam Washing", 349, None),
    ("Car Cleaning", "Interior Deep Cleaning", 549, 849),
    ("Car Cleaning", "Steam Washing", 549, 749),
    ("Car Cleaning", "Full Car Detailing", 849, 1549),
    ("Car Cleaning", "Exterior Deep Cleaning", 549, 849),

    ("Home Cleaning", "Furniture Cleaning", 449, 1449),
    ("Commercial Cleaning", "Office Cleaning", 449, 1849),
    ("Home Cleaning", "Floor Cleaning", 399, 899),
    ("Home Cleaning", "Dishwashing & Utensils Cleaning", 99, 299),
    ("Home Services", "Doorstep Garbage Collection", 49, 399),
    ("Appliance Services", "AC Services", 449, 1449),
    ("Cleaning Services", "Water Tank Cleaning", 449, 1449),
    ("Home Cleaning", "Kitchen Cleaning", 549, None),
    ("Home Cleaning", "Carpet Cleaning", 449, 1849),
    ("Home Cleaning", "Sofa-Dry Cleaning", 199, 1949),
]

VARIANTS = {
    "Floor Cleaning": [
        ("1 BHK · up to 600 sq. ft.", 399),
        ("2 BHK · up to 1,000 sq. ft.", 549),
        ("3 BHK · up to 1,500 sq. ft.", 699),
        ("4 BHK · up to 2,000 sq. ft.", 899),
    ],
    "Dishwashing & Utensils Cleaning": [
        ("Small · up to 10 utensils", 99),
        ("Medium · up to 20 utensils", 199),
        ("Large · up to 30 utensils", 299),
    ],
    "Doorstep Garbage Collection": [
        ("One-time pickup", 49),
        ("Weekly collection · per month", 149),
        ("Alternate-day collection · per month", 249),
        ("Daily collection · per month", 399),
    ],
}


class Command(BaseCommand):
    help = "Create the default CleanKart categories and services"

    def handle(self, *args, **options):
        for index, (category_name, service_name, price, max_price) in enumerate(
            SERVICES,
            start=1,
        ):
            category, _ = Category.objects.get_or_create(
                name=category_name,
                defaults={
                    "is_active": True,
                },
            )

            service, created = Service.objects.update_or_create(
                name=service_name,
                defaults={
                    "category": category,
                    "price": price,
                    "max_price": max_price,
                    "is_active": True,
                    "is_top_service": index <= 5,
                    "display_order": index,
                },
            )
            for variant_order, (variant_name, variant_price) in enumerate(
                VARIANTS.get(service_name, []),
            ):
                ServiceVariant.objects.update_or_create(
                    service=service,
                    name=variant_name,
                    defaults={
                        "price": variant_price,
                        "is_active": True,
                        "display_order": variant_order,
                    },
                )

            action = "Created" if created else "Updated"

            self.stdout.write(
                self.style.SUCCESS(
                    f"{action}: {service_name}"
                )
            )

        Service.objects.filter(slug="house-cleaning").update(is_active=False)

        self.stdout.write(
            self.style.SUCCESS(
                "\nCleanKart services seeded successfully."
            )
        )
        