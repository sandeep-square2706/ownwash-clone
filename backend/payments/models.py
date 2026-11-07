from django.db import models
from django.conf import settings

from bookings.models import Booking


class Payment(models.Model):
    class Status(models.TextChoices):
        CREATED = "CREATED", "Created"
        AUTHORIZED = "AUTHORIZED", "Authorized"
        CAPTURED = "CAPTURED", "Captured"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"
        PENDING_REVIEW = "PENDING_REVIEW", "Pending UPI Review"
        REJECTED = "REJECTED", "UPI Payment Rejected"

    class Method(models.TextChoices):
        RAZORPAY = "RAZORPAY", "Razorpay"
        DIRECT_UPI = "DIRECT_UPI", "Direct UPI"

    booking = models.ForeignKey(
        Booking,
        on_delete=models.PROTECT,
        related_name="payments",
    )

    method = models.CharField(
        max_length=20,
        choices=Method.choices,
        default=Method.RAZORPAY,
    )

    razorpay_order_id = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )

    razorpay_payment_id = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=3,
        default="INR",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CREATED,
    )

    razorpay_signature = models.CharField(
        max_length=256,
        blank=True,
    )

    upi_transaction_reference = models.CharField(
        max_length=32,
        unique=True,
        null=True,
        blank=True,
    )

    failure_reason = models.TextField(blank=True)

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="reviewed_payment_records",
        null=True,
        blank=True,
    )

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    verified_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.booking.booking_reference} - "
            f"{self.status}"
        )