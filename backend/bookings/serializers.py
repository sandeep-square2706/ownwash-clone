from rest_framework import serializers

from .models import Booking, BookingItem


class BookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingItem
        fields = [
    "id",
   
    "status",
    "address",
    "address_details",
    "scheduled_date",
    "scheduled_time",
    "subtotal",
    "discount",
    "tax",
    "convenience_fee",
    "total_amount",
    "notes",
    "items",
    "created_at",
    "updated_at",
]


class BookingSerializer(serializers.ModelSerializer):
    items = BookingItemSerializer(
        many=True,
        read_only=True,
    )
    address_details = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            
            "status",
            "address",
            "address_details",
            "scheduled_date",
            "scheduled_time",
            "subtotal",
            "discount",
            "tax",
            "total_amount",
            "notes",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
    "id",
    "booking_reference",
    "status",
    "subtotal",
    "discount",
    "tax",
    "convenience_fee",
    "total_amount",
    "items",
    "created_at",
    "updated_at",
]

    def get_address_details(self, obj):
        address = obj.address

        return {
            "id": address.id,
            "full_name": address.full_name,
            "phone": address.phone,
            "house_number": address.house_number,
            "street": address.street,
            "area": address.area,
            "landmark": address.landmark,
            "city": address.city,
            "district": address.district,
            "state": address.state,
            "pincode": address.pincode,
            "address_type": address.address_type,
        }

    def validate_address(self, address):
        request = self.context.get("request")

        if request and address.user_id != request.user.id:
            raise serializers.ValidationError(
                "You can only use your own address."
            )

        return address

    def validate(self, attrs):
        if not attrs.get("scheduled_date"):
            raise serializers.ValidationError(
                {
                    "scheduled_date":
                    "Booking date is required."
                }
            )

        if not attrs.get("scheduled_time"):
            raise serializers.ValidationError(
                {
                    "scheduled_time":
                    "Booking time is required."
                }
            )

        return attrs