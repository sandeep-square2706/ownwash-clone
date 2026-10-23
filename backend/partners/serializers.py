from rest_framework import serializers
from .models import PartnerProfile, PartnerService, PartnerDocument, PartnerAvailability, PartnerBooking, PartnerPayout, PartnerSupportTicket

class PartnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=PartnerProfile
        exclude=("user", "bank_holder", "bank_name", "bank_account_masked", "ifsc")
        read_only_fields=("status", "application_reference", "review_reason", "agreement_accepted_at", "agreement_version", "created_at", "updated_at")

class PartnerServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model=PartnerService
        fields="__all__"
        read_only_fields=("partner","is_approved","approved_at")

class PartnerDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model=PartnerDocument
        fields=("id","document_type","file","verification_status","review_reason","created_at","updated_at")
        read_only_fields=("verification_status","review_reason","created_at","updated_at")

class PartnerAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model=PartnerAvailability
        exclude=("partner",)

class PartnerBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model=PartnerBooking
        exclude=("partner",)

class PartnerPayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model=PartnerPayout
        exclude=("partner",)

class PartnerSupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model=PartnerSupportTicket
        exclude=("partner",)
        read_only_fields=("status","created_at","updated_at")
