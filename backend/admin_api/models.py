from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


class Offer(models.Model):
    class DiscountType(models.TextChoices):
        PERCENTAGE = "PERCENTAGE", "Percentage"
        FIXED_AMOUNT = "FIXED_AMOUNT", "Fixed amount"

    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    code = models.CharField(max_length=40, unique=True)
    type = models.CharField(max_length=20, choices=DiscountType.choices)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_order = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    valid_from = models.DateField(null=True, blank=True)
    valid_to = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    show_on_homepage = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def clean(self):
        self.code = self.code.strip().upper()
        if self.value <= 0:
            raise ValidationError({"value": "Discount must be greater than zero."})
        if self.type == self.DiscountType.PERCENTAGE and self.value > 100:
            raise ValidationError({"value": "Percentage discounts cannot exceed 100%."})
        if self.minimum_order < 0:
            raise ValidationError({"minimum_order": "Minimum order cannot be negative."})
        if self.valid_from and self.valid_to and self.valid_from > self.valid_to:
            raise ValidationError({"valid_to": "End date must be on or after the start date."})

    def save(self, *args, **kwargs):
        self.code = self.code.strip().upper()
        super().save(*args, **kwargs)

    def is_current(self, today=None):
        today = today or timezone.localdate()
        return (
            self.is_active
            and (self.valid_from is None or self.valid_from <= today)
            and (self.valid_to is None or self.valid_to >= today)
        )

    def __str__(self):
        return f"{self.name} ({self.code})"
