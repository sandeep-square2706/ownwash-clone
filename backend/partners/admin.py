from django.contrib import admin
from .models import *

@admin.register(PartnerProfile)
class PartnerProfileAdmin(admin.ModelAdmin):
    list_display=("application_reference","legal_name","phone","status","created_at")
    list_filter=("status","partner_type")
    search_fields=("application_reference","legal_name","phone","email","pincode")
    readonly_fields=("application_reference","created_at","updated_at")

@admin.register(PartnerService)
class PartnerServiceAdmin(admin.ModelAdmin):
    list_display=("partner","service_slug","is_approved","approved_at")
    list_filter=("is_approved",)

@admin.register(PartnerDocument)
class PartnerDocumentAdmin(admin.ModelAdmin):
    list_display=("partner","document_type","verification_status","created_at")
    list_filter=("document_type","verification_status")

@admin.register(PartnerApproval)
class PartnerApprovalAdmin(admin.ModelAdmin):
    list_display=("partner","actor","action","created_at")
    list_filter=("action",)

@admin.register(PartnerAvailability)
class PartnerAvailabilityAdmin(admin.ModelAdmin):
    list_display=("partner","is_available","max_jobs_per_day")

@admin.register(PartnerBooking)
class PartnerBookingAdmin(admin.ModelAdmin):
    list_display=("booking_reference","partner","service_name","scheduled_at","status")
    list_filter=("status",)
    search_fields=("booking_reference","partner__legal_name")

@admin.register(PartnerPayout)
class PartnerPayoutAdmin(admin.ModelAdmin):
    list_display=("reference","partner","amount","status","created_at")
    list_filter=("status",)

@admin.register(PartnerSupportTicket)
class PartnerSupportTicketAdmin(admin.ModelAdmin):
    list_display=("id","partner","category","status","created_at")
    list_filter=("status","category")
