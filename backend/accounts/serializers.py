from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Address, User
from partners.models import PartnerProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "password",
        ]
        read_only_fields = [
            "id",
        ]

    def validate_email(self, value):
        return value.lower().strip()

    def create(self, validated_data):
        password = validated_data.pop("password")

        email = validated_data["email"]

        base_username = email.split("@")[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            password=password,
            role=User.Role.CUSTOMER,
            **validated_data,
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=False,
    )
    reference_id = serializers.CharField(
        required=False,
        allow_blank=False,
        trim_whitespace=True,
    )

    password = serializers.CharField(
        write_only=True,
    )

    def validate(self, attrs):
        email = attrs.get("email")
        reference_id = attrs.get("reference_id")
        if bool(email) == bool(reference_id):
            raise serializers.ValidationError(
                "Provide either an email address or a partner reference ID."
            )

        password = attrs["password"]
        if reference_id:
            partner = PartnerProfile.objects.select_related("user").filter(
                application_reference__iexact=reference_id,
            ).first()
            user = partner.user if partner is not None else None
        else:
            user = User.objects.filter(email__iexact=email.strip()).first()

        authenticated_user = (
            authenticate(username=user.email, password=password)
            if user is not None
            else None
        )

        if authenticated_user is None:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not authenticated_user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        if (
            authenticated_user.role == User.Role.PARTNER
            and hasattr(authenticated_user, "partner_profile")
            and authenticated_user.partner_profile.status
            == PartnerProfile.Status.SUSPENDED
        ):
            raise serializers.ValidationError(
                "This partner account is blocked. Contact Zaapino support."
            )

        if (
            authenticated_user.role == User.Role.CUSTOMER
            and not authenticated_user.is_email_verified
        ):
            raise serializers.ValidationError(
                "Please verify your email address before signing in."
            )

        attrs["user"] = authenticated_user

        return attrs


class EmailAddressSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.strip().lower()


class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(trim_whitespace=True)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "phone",
            "role",
            "is_phone_verified",
            "is_email_verified",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "email",
            "role",
            "is_phone_verified",
            "is_email_verified",
            "created_at",
            "updated_at",
        ]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address

        fields = [
            "id",
            "full_name",
            "phone",
            "house_number",
            "street",
            "area",
            "landmark",
            "city",
            "district",
            "state",
            "pincode",
            "address_type",
            "is_default",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_pincode(self, value):
        value = str(value).strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                "PIN code must contain only numbers."
            )

        if len(value) != 6:
            raise serializers.ValidationError(
                "PIN code must be exactly 6 digits."
            )

        return value

    def validate_phone(self, value):
        value = str(value).strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone number must contain only numbers."
            )

        if len(value) != 10:
            raise serializers.ValidationError(
                "Phone number must be exactly 10 digits."
            )

        return value