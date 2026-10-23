from decimal import Decimal

from rest_framework import serializers

from services.models import Service, ServiceVariant

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(
        source="service.name",
        read_only=True,
    )

    service_slug = serializers.CharField(
        source="service.slug",
        read_only=True,
    )

    service_image = serializers.SerializerMethodField()

    variant_name = serializers.CharField(
        source="variant.name",
        read_only=True,
        allow_null=True,
    )

    unit_price = serializers.SerializerMethodField()
    addon_total = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem

        fields = [
            "id",
            "service",
            "service_name",
            "service_slug",
            "service_image",
            "variant",
            "variant_name",
            "quantity",
            "selected_addons",
            "price_snapshot",
            "unit_price",
            "addon_total",
            "line_total",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "price_snapshot",
            "unit_price",
            "addon_total",
            "line_total",
            "created_at",
            "updated_at",
        ]

    def get_service_image(self, obj):
        image = (
            obj.service.images
            .filter(is_primary=True)
            .first()
        )

        if image is None:
            image = obj.service.images.first()

        if not image or not image.image:
            return ""

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                image.image.url
            )

        return image.image.url

    def calculate_base_price(self, obj):
        if obj.variant:
            return obj.variant.price

        return obj.service.price

    def calculate_addon_total(self, obj):
        total = Decimal("0.00")

        selected_ids = {
            str(addon_id)
            for addon_id in obj.selected_addons
        }

        for addon in obj.service.addons or []:
            addon_id = str(addon.get("id", ""))

            if addon_id not in selected_ids:
                continue

            try:
                price = Decimal(
                    str(addon.get("price", 0))
                )
            except Exception:
                price = Decimal("0.00")

            total += price

        return total

    def get_unit_price(self, obj):
        return float(
            self.calculate_base_price(obj)
        )

    def get_addon_total(self, obj):
        return float(
            self.calculate_addon_total(obj)
        )

    def get_line_total(self, obj):
        total = (
            self.calculate_base_price(obj)
            + self.calculate_addon_total(obj)
        ) * obj.quantity

        return float(total)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(
        many=True,
        read_only=True,
    )

    subtotal = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart

        fields = [
            "id",
            "items",
            "subtotal",
            "item_count",
            "created_at",
            "updated_at",
        ]

    def get_subtotal(self, obj):
        subtotal = Decimal("0.00")

        for item in obj.items.select_related(
            "service",
            "variant",
        ):
            base_price = (
                item.variant.price
                if item.variant
                else item.service.price
            )

            addon_total = Decimal("0.00")

            selected_ids = {
                str(addon_id)
                for addon_id in item.selected_addons
            }

            for addon in item.service.addons or []:
                if str(addon.get("id")) not in selected_ids:
                    continue

                try:
                    addon_total += Decimal(
                        str(addon.get("price", 0))
                    )
                except Exception:
                    pass

            subtotal += (
                base_price + addon_total
            ) * item.quantity

        return float(subtotal)

    def get_item_count(self, obj):
        return sum(
            item.quantity
            for item in obj.items.all()
        )


class AddCartItemSerializer(serializers.Serializer):
    service = serializers.IntegerField()

    variant = serializers.IntegerField(
        required=False,
        allow_null=True,
    )

    selected_addons = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )

    quantity = serializers.IntegerField(
        required=False,
        min_value=1,
        default=1,
    )

    def validate_service(self, value):
        try:
            return Service.objects.get(
                id=value,
                is_active=True,
            )
        except Service.DoesNotExist:
            raise serializers.ValidationError(
                "Service does not exist or is inactive."
            )

    def validate_variant(self, value):
        if value is None:
            return None

        try:
            return ServiceVariant.objects.get(
                id=value,
                is_active=True,
            )
        except ServiceVariant.DoesNotExist:
            raise serializers.ValidationError(
                "Variant does not exist or is inactive."
            )

    def validate(self, attrs):
        service = attrs["service"]
        variant = attrs.get("variant")

        if variant and variant.service_id != service.id:
            raise serializers.ValidationError(
                {
                    "variant": (
                        "Selected variant does not belong "
                        "to this service."
                    )
                }
            )

        selected_addons = attrs.get(
            "selected_addons",
            [],
        )

        valid_addon_ids = {
            str(addon.get("id"))
            for addon in (service.addons or [])
            if addon.get("id") is not None
        }

        invalid_addons = [
            addon_id
            for addon_id in selected_addons
            if str(addon_id) not in valid_addon_ids
        ]

        if invalid_addons:
            raise serializers.ValidationError(
                {
                    "selected_addons": (
                        "One or more selected add-ons "
                        "are invalid."
                    )
                }
            )

        return attrs