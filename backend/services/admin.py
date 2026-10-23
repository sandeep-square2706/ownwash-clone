from django.contrib import admin

from .models import (
    Category,
    Service,
    ServiceImage,
    ServiceVariant,
)


class ServiceImageInline(admin.TabularInline):
    model = ServiceImage
    extra = 1


class ServiceVariantInline(admin.TabularInline):
    model = ServiceVariant
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "display_order",
    )

    list_filter = ("is_active",)
    search_fields = ("name",)

    prepopulated_fields = {
        "slug": ("name",)
    }


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "max_price",
        "is_top_service",
        "is_active",
        "display_order",
    )

    list_filter = (
        "category",
        "is_active",
        "is_top_service",
    )

    search_fields = (
        "name",
        "description",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }

    list_editable = (
        "price",
        "is_top_service",
        "is_active",
        "display_order",
    )

    inlines = [
        ServiceVariantInline,
        ServiceImageInline,
    ]


@admin.register(ServiceImage)
class ServiceImageAdmin(admin.ModelAdmin):
    list_display = (
        "service",
        "is_primary",
        "display_order",
    )

    list_filter = ("is_primary",)


@admin.register(ServiceVariant)
class ServiceVariantAdmin(admin.ModelAdmin):
    list_display = (
        "service",
        "name",
        "price",
        "is_active",
        "display_order",
    )

    list_filter = ("is_active",)

    search_fields = (
        "service__name",
        "name",
    )