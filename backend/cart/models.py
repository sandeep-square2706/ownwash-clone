from django.conf import settings
from django.db import models

from services.models import Service, ServiceVariant


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Cart - {self.user}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name="cart_items",
    )

    variant = models.ForeignKey(
        ServiceVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="cart_items",
    )

    quantity = models.PositiveIntegerField(default=1)

    selected_addons = models.JSONField(
        default=list,
        blank=True,
    )

    price_snapshot = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.service.name} x {self.quantity}"