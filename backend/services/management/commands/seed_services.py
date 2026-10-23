from django.core.management.base import BaseCommand
from services.models import Category, Service


SERVICES = [
    ("Car Cleaning", "Foam Washing", 349, None),
    ("Car Cleaning", "Interior Deep Cleaning", 549, 849),
    ("Car Cleaning", "Steam Washing", 549, 749),
    ("Car Cleaning", "Full Car Detailing", 849, 1549),
    ("Car Cleaning", "Exterior Deep Cleaning", 549, 849),

    ("Home Cleaning", "Furniture Cleaning", 449, 1449),
    ("Commercial Cleaning", "Office Cleaning", 449, 1849),
    ("Home Cleaning", "House Cleaning", 549, None),
    ("Appliance Services", "AC Services", 449, 1449),
    ("Cleaning Services", "Water Tank Cleaning", 449, 1449),
    ("Home Cleaning", "Kitchen Cleaning", 549, None),
    ("Home Cleaning", "Carpet Cleaning", 449, 1849),
    ("Home Cleaning", "Sofa-Dry Cleaning", 199, 1949),
]


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

            action = "Created" if created else "Updated"

            self.stdout.write(
                self.style.SUCCESS(
                    f"{action}: {service_name}"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                "\nCleanKart services seeded successfully."
            )
        )
        