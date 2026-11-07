from rest_framework import serializers
from .models import PartnerProfile, PartnerService, PartnerDocument, PartnerAvailability, PartnerBooking, PartnerPayout, PartnerSupportTicket, PartnerInvoice

class PartnerProfileSerializer(serializers.ModelSerializer):
    billing_blocked=serializers.SerializerMethodField()

    class Meta:
        model=PartnerProfile
        exclude=("user", "bank_holder", "bank_name", "bank_account_masked", "ifsc")
        read_only_fields=("status", "application_reference", "review_reason", "agreement_accepted_at", "agreement_version", "created_at", "updated_at")

    def get_billing_blocked(self, partner):
        return partner.billing_blocked

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

class PartnerInvoiceSerializer(serializers.ModelSerializer):
    is_overdue=serializers.BooleanField(read_only=True)

    class Meta:
        model=PartnerInvoice
        fields=("id","reference","description","amount","due_date","status","is_overdue","payment_reference","paid_at","created_at")
        read_only_fields=("id","reference","status","is_overdue","payment_reference","paid_at","created_at")
