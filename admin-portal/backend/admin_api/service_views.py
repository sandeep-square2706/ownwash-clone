"""Admin-only CRUD endpoints for CleanKart services.

These endpoints intentionally archive services on DELETE instead of deleting
rows, because existing bookings may still reference a service.
"""
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.utils.text import slugify
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from services.models import Category, Service

from .permissions import IsAdminUser


class AdminServiceBaseView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]


def _unique_slug(model, value, exclude_pk=None):
    base = slugify(value) or "service"
    candidate = base
    suffix = 2
    query = model.objects.all()
    if exclude_pk is not None:
        query = query.exclude(pk=exclude_pk)
    while query.filter(slug=candidate).exists():
        candidate = f"{base}-{suffix}"
        suffix += 1
    return candidate


def _resolve_category(data):
    category_id = data.get("category_id")
    if category_id not in (None, ""):
        try:
            return Category.objects.get(pk=int(category_id))
        except (Category.DoesNotExist, TypeError, ValueError):
            raise ValueError("Select a valid service category.")

    category_name = str(data.get("category") or "").strip()
    if not category_name:
        raise ValueError("Service category is required.")

    if len(category_name) > 100:
        raise ValueError("Category name must be 100 characters or fewer.")

    existing = Category.objects.filter(name__iexact=category_name).first()
    if existing:
        return existing

    return Category.objects.create(
        name=category_name,
        slug=_unique_slug(Category, category_name),
        is_active=True,
    )


def _decimal_value(value, field_name, required=False):
    if value in (None, ""):
        if required:
            raise ValueError(f"{field_name} is required.")
        return None
    try:
        result = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        raise ValueError(f"Enter a valid {field_name.lower()}.")
    if result < 0:
        raise ValueError(f"{field_name} cannot be negative.")
    return result


def _int_value(value, field_name, allow_empty=True):
    if value in (None, "") and allow_empty:
        return None
    try:
        result = int(value)
    except (TypeError, ValueError):
        raise ValueError(f"Enter a valid {field_name.lower()}.")
    if result < 0:
        raise ValueError(f"{field_name} cannot be negative.")
    return result


def _service_payload(service):
    variant_prices = list(
        service.variants.filter(is_active=True).values_list("price", flat=True)
    )
    prices = [service.price, *variant_prices]
    if service.max_price is not None:
        prices.append(service.max_price)

    return {
        "id": service.id,
        "name": service.name,
        "slug": service.slug,
        "category": service.category.name,
        "base_price": float(service.price),
        "min_price": float(min(prices)),
        "max_price": float(max(prices)),
        "duration": service.duration_minutes,
        "is_active": service.is_active,
        "short_description": service.short_description,
        "description": service.description,
        "features": service.features or [],
        "addons": service.addons or [],
        "is_top_service": service.is_top_service,
        "display_order": service.display_order,
    }


def _apply_service_fields(service, data, creating=False):
    if creating or "name" in data:
        name = str(data.get("name") or "").strip()
        if not name:
            raise ValueError("Service name is required.")
        if len(name) > 150:
            raise ValueError("Service name must be 150 characters or fewer.")
        service.name = name

    if creating or "category" in data or "category_id" in data:
        service.category = _resolve_category(data)

    price_key_present = "base_price" in data or "price" in data
    if creating or price_key_present:
        raw_price = data.get("base_price", data.get("price"))
        price = _decimal_value(raw_price, "Base price", required=True)
        service.price = price

    if creating or "max_price" in data:
        service.max_price = _decimal_value(data.get("max_price"), "Maximum price")

    if service.max_price is not None and service.max_price < service.price:
        raise ValueError("Maximum price cannot be lower than the base price.")

    if creating or "duration" in data or "duration_minutes" in data:
        raw_duration = data.get("duration", data.get("duration_minutes"))
        service.duration_minutes = _int_value(raw_duration, "Duration")

    if creating or "short_description" in data:
        service.short_description = str(data.get("short_description") or "").strip()[:255]

    if creating or "description" in data:
        service.description = str(data.get("description") or "").strip()

    for field in ("features", "addons"):
        if creating or field in data:
            value = data.get(field, [])
            if value is None:
                value = []
            if not isinstance(value, list):
                raise ValueError(f"{field.capitalize()} must be sent as a list.")
            setattr(service, field, value)

    for field in ("is_active", "is_top_service"):
        if creating or field in data:
            value = data.get(field, True if field == "is_active" else False)
            if not isinstance(value, bool):
                raise ValueError(f"{field} must be true or false.")
            setattr(service, field, value)

    if creating or "display_order" in data:
        service.display_order = _int_value(data.get("display_order", 0), "Display order", allow_empty=False)

    if creating:
        service.slug = _unique_slug(Service, service.name)
    elif "slug" in data:
        requested_slug = str(data.get("slug") or "").strip()
        if not requested_slug:
            raise ValueError("Service slug cannot be empty.")
        service.slug = _unique_slug(Service, requested_slug, exclude_pk=service.pk)

    service.save()
    return service


class AdminServicesView(AdminServiceBaseView):
    def get(self, request):
        services = Service.objects.select_related("category").prefetch_related("variants").order_by(
            "display_order", "name"
        )
        return Response([_service_payload(service) for service in services])

    @transaction.atomic
    def post(self, request):
        service = Service()
        try:
            _apply_service_fields(service, request.data, creating=True)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(_service_payload(service), status=status.HTTP_201_CREATED)


class AdminServiceDetailView(AdminServiceBaseView):
    def get_object(self, pk):
        return Service.objects.select_related("category").prefetch_related("variants").filter(pk=pk).first()

    def get(self, request, pk):
        service = self.get_object(pk)
        if not service:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(_service_payload(service))

    @transaction.atomic
    def patch(self, request, pk):
        service = self.get_object(pk)
        if not service:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            _apply_service_fields(service, request.data, creating=False)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({**_service_payload(service), "message": "Service updated successfully."})

    def delete(self, request, pk):
        service = self.get_object(pk)
        if not service:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        if not service.is_active:
            return Response({"id": service.id, "is_active": False, "message": "Service is already archived."})
        service.is_active = False
        service.save(update_fields=["is_active", "updated_at"])
        return Response({
            "id": service.id,
            "is_active": False,
            "message": "Service archived successfully. It is no longer visible in the customer catalogue.",
        })
