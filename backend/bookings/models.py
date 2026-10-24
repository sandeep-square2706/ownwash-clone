import uuid
from decimal import Decimal

from django.conf import settings
from django.db import models

from accounts.models import Address
from services.models import Service, ServiceVariant


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING_PAYMENT = "PENDING_PAYMENT", "Pending Payment"
        CONFIRMED = "CONFIRMED", "Confirmed"
        ASSIGNED = "ASSIGNED", "Assigned"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        related_name="bookings",
    )
    booking_reference = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
    )
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING_PAYMENT,
    )
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    subtotal = models.DecimalField(
    max_digits=10,
    decimal_places=2,
)

    discount = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=Decimal("0.00"),
)

    tax = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=Decimal("0.00"),
)

    convenience_fee = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=Decimal("0.00"),
)

    total_amount = models.DecimalField(
    max_digits=10,
    decimal_places=2,
)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = (
                f"CKB-{uuid.uuid4().hex[:8].upper()}"
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return self.booking_reference


class BookingItem(models.Model):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="items",
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
    )
    variant = models.ForeignKey(
        ServiceVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )
    service_name = models.CharField(max_length=200)
    variant_name = models.CharField(
        max_length=200,
        blank=True,
    )
    quantity = models.PositiveIntegerField(default=1)
    selected_addons = models.JSONField(
        default=list,
        blank=True,
    )
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    def __str__(self):
        return f"{self.service_name} x {self.quantity}"