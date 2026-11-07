from django.db import migrations


DISPLAY_ORDER_BY_SLUG = {
    "floor-cleaning": 8,
    "dishwashing-utensils-cleaning": 9,
    "doorstep-garbage-collection": 10,
    "ac-services": 11,
    "water-tank-cleaning": 12,
    "kitchen-cleaning": 13,
    "carpet-cleaning": 14,
    "sofa-dry-cleaning": 15,
    "cobweb-cleaning": 16,
}


def order_replacement_services(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    database = schema_editor.connection.alias
    for slug, display_order in DISPLAY_ORDER_BY_SLUG.items():
        Service.objects.using(database).filter(slug=slug).update(display_order=display_order)


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0004_replace_house_cleaning_services"),
    ]

    operations = [
        migrations.RunPython(order_replacement_services, migrations.RunPython.noop),
    ]
