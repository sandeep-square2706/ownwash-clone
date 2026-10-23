from rest_framework import serializers

from .models import Category, Service, ServiceImage, ServiceVariant


class ServiceImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ServiceImage
        fields = [
            "id",
            "image",
            "alt_text",
            "is_primary",
            "display_order",
        ]

    def get_image(self, obj):
        if not obj.image:
            return ""

        request = self.context.get("request")
        url = obj.image.url

        if request:
            return request.build_absolute_uri(url)

        return url


class ServiceVariantSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    originalPrice = serializers.SerializerMethodField()

    class Meta:
        model = ServiceVariant
        fields = [
            "id",
            "name",
            "price",
            "originalPrice",
            "duration_minutes",
            "is_active",
            "display_order",
        ]

    def get_id(self, obj):
        return str(obj.id)

    def get_originalPrice(self, obj):
        return None


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_active",
            "display_order",
        ]


class ServiceSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")

    basePrice = serializers.SerializerMethodField()
    minPrice = serializers.SerializerMethodField()
    maxPrice = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    # Frontend expects: images: string[]
    images = serializers.SerializerMethodField()

    variants = ServiceVariantSerializer(
        many=True,
        read_only=True,
    )

    isActive = serializers.BooleanField(
        source="is_active",
        read_only=True,
    )

    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "basePrice",
            "minPrice",
            "maxPrice",
            "description",
            "duration",
            "images",
            "features",
            "addons",
            "variants",
            "isActive",
        ]

    def get_images(self, obj):
        """
        Return service images as a simple list of absolute URLs.

        Example:
        [
            "http://127.0.0.1:8000/media/services/foam-washing-1.jpg",
            "http://127.0.0.1:8000/media/services/foam-washing-2.jpg"
        ]
        """

        request = self.context.get("request")

        image_urls = []

        for service_image in obj.images.all():
            if not service_image.image:
                continue

            url = service_image.image.url

            if request:
                url = request.build_absolute_uri(url)

            image_urls.append(url)

        return image_urls

    def get_basePrice(self, obj):
        return float(obj.price)

    def get_minPrice(self, obj):
        prices = list(
            obj.variants
            .filter(is_active=True)
            .values_list("price", flat=True)
        )

        if prices:
            return float(min(prices))

        return float(obj.price)

    def get_maxPrice(self, obj):
        prices = list(
            obj.variants
            .filter(is_active=True)
            .values_list("price", flat=True)
        )

        if prices:
            return float(max(prices))

        if obj.max_price is not None:
            return float(obj.max_price)

        return float(obj.price)

    def get_duration(self, obj):
        if not obj.duration_minutes:
            return ""

        hours, minutes = divmod(
            obj.duration_minutes,
            60,
        )

        if hours and minutes:
            return f"{hours}–{hours + 1} hrs"

        if hours:
            return f"{hours} hrs"

        return f"{minutes} min"