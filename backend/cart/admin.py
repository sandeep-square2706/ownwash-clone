from django.contrib import admin

from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

    readonly_fields = (
        "price_snapshot",
        "created_at",
        "updated_at",
    )


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "user__phone",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    inlines = [
        CartItemInline,
    ]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cart",
        "service",
        "variant",
        "quantity",
        "price_snapshot",
        "created_at",
    )

    list_filter = (
        "service",
        "created_at",
    )

    search_fields = (
        "cart__user__username",
        "cart__user__email",
        "service__name",
    )

    readonly_fields = (
        "price_snapshot",
        "created_at",
        "updated_at",
    )