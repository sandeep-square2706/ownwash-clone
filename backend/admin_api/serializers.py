import json

from django.utils.text import slugify
from rest_framework import serializers

from accounts.models import User
from partners.models import PartnerProfile
from services.models import Category, Service, ServiceImage

from .models import Offer


class AdminServiceSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    category = serializers.CharField(max_length=100)
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    max_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0,
        required=False,
        allow_null=True,
    )
    duration = serializers.IntegerField(min_value=1, required=False, allow_null=True)
    short_description = serializers.CharField(max_length=255, required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    features = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )
    addons = serializers.ListField(
        child=serializers.JSONField(),
        required=False,
        allow_empty=True,
    )
    is_active = serializers.BooleanField(required=False, default=True)
    is_top_service = serializers.BooleanField(required=False, default=False)
    image = serializers.ImageField(required=False, allow_null=True)

    def to_internal_value(self, data):
        data = data.dict() if hasattr(data, "dict") else data.copy()
        for field in ("features", "addons"):
            value = data.get(field)
            if isinstance(value, str):
                try:
                    data[field] = json.loads(value)
                except json.JSONDecodeError:
                    raise serializers.ValidationError(
                        {field: "Enter a valid JSON list."}
                    )
        for field in ("max_price", "duration"):
            if data.get(field) == "":
                data[field] = None
        return super().to_internal_value(data)

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Service name cannot be empty.")
        return value

    def validate_category(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Category is required.")
        return value

    def validate(self, attrs):
        max_price = attrs.get(
            "max_price",
            self.instance.max_price if self.instance is not None else None,
        )
        base_price = attrs.get(
            "base_price",
            self.instance.price if self.instance is not None else None,
        )
        if max_price is not None and base_price is not None and max_price < base_price:
            raise serializers.ValidationError(
                {"max_price": "Maximum price must be at least the base price."}
            )
        return attrs

    def save(self, *, instance=None):
        data = self.validated_data.copy()
        image = data.pop("image", None)
        category_name = data.pop(
            "category",
            instance.category.name if instance is not None else None,
        )
        category = Category.objects.filter(name__iexact=category_name).first()
        if category is None:
            category_slug = slugify(category_name)[:120]
            base_slug = category_slug or "category"
            category_slug = base_slug
            suffix = 2
            while Category.objects.filter(slug=category_slug).exists():
                category_slug = f"{base_slug[:114]}-{suffix}"
                suffix += 1
            category = Category.objects.create(
                name=category_name,
                slug=category_slug,
                is_active=True,
            )

        data["category"] = category
        if "base_price" in data:
            data["price"] = data.pop("base_price")
        if "duration" in data:
            data["duration_minutes"] = data.pop("duration")

        if instance is None:
            service_slug = slugify(data["name"])[:180] or "service"
            base_slug = service_slug
            suffix = 2
            while Service.objects.filter(slug=service_slug).exists():
                service_slug = f"{base_slug[:174]}-{suffix}"
                suffix += 1
            data["slug"] = service_slug
            instance = Service.objects.create(**data)
        else:
            for field, value in data.items():
                setattr(instance, field, value)
            instance.save()

        if image:
            for old_image in instance.images.filter(is_primary=True):
                if old_image.image:
                    old_image.image.storage.delete(old_image.image.name)
                old_image.delete()
            ServiceImage.objects.create(
                service=instance,
                image=image,
                alt_text=f"{instance.name} service",
                is_primary=True,
                display_order=0,
            )
        return instance


class AdminPartnerCreateSerializer(serializers.Serializer):
    legal_name = serializers.CharField(max_length=160)
    display_name = serializers.CharField(max_length=160, required=False, allow_blank=True)
    business_name = serializers.CharField(max_length=160, required=False, allow_blank=True)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    partner_type = serializers.ChoiceField(
        choices=PartnerProfile.PartnerType.choices,
        default=PartnerProfile.PartnerType.INDIVIDUAL,
    )
    city = serializers.CharField(max_length=80, required=False, allow_blank=True)
    state = serializers.CharField(max_length=80, required=False, allow_blank=True)

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account already uses this email.")
        return value

    def validate_phone(self, value):
        value = value.strip()
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("An account already uses this phone number.")
        return value


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = [
            "id",
            "name",
            "description",
            "code",
            "type",
            "value",
            "minimum_order",
            "valid_from",
            "valid_to",
            "is_active",
            "show_on_homepage",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_code(self, value):
        return value.strip().upper()

    def validate(self, attrs):
        instance = self.instance
        discount_type = attrs.get("type", getattr(instance, "type", None))
        value = attrs.get("value", getattr(instance, "value", None))
        minimum_order = attrs.get(
            "minimum_order",
            getattr(instance, "minimum_order", 0),
        )
        valid_from = attrs.get(
            "valid_from",
            getattr(instance, "valid_from", None),
        )
        valid_to = attrs.get(
            "valid_to",
            getattr(instance, "valid_to", None),
        )

        errors = {}
        if value is not None and value <= 0:
            errors["value"] = "Discount must be greater than zero."
        if (
            value is not None
            and discount_type == Offer.DiscountType.PERCENTAGE
            and value > 100
        ):
            errors["value"] = "Percentage discounts cannot exceed 100%."
        if minimum_order is not None and minimum_order < 0:
            errors["minimum_order"] = "Minimum order cannot be negative."
        if valid_from and valid_to and valid_from > valid_to:
            errors["valid_to"] = "End date must be on or after the start date."
        if errors:
            raise serializers.ValidationError(errors)
        return attrs
