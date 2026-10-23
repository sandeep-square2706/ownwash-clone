from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from .private_storage import private_storage

class PartnerProfile(models.Model):
    class Status(models.TextChoices):
        DRAFT="DRAFT","Draft"; SUBMITTED="SUBMITTED","Submitted"; UNDER_REVIEW="UNDER_REVIEW","Under Review"
        MORE_INFO="MORE_INFO","More Information Required"; APPROVED="APPROVED","Approved"; REJECTED="REJECTED","Rejected"; SUSPENDED="SUSPENDED","Suspended"
    class PartnerType(models.TextChoices):
        INDIVIDUAL="INDIVIDUAL","Individual"; SOLE_PROPRIETOR="SOLE_PROPRIETOR","Sole Proprietor"; PARTNERSHIP="PARTNERSHIP","Partnership"; COMPANY="COMPANY","Company"
    user=models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="partner_profile")
    partner_type=models.CharField(max_length=30,choices=PartnerType.choices,default=PartnerType.INDIVIDUAL)
    legal_name=models.CharField(max_length=160); display_name=models.CharField(max_length=160,blank=True)
    business_name=models.CharField(max_length=160,blank=True)
    phone=models.CharField(max_length=20); email=models.EmailField(blank=True)
    profile_photo=models.ImageField(upload_to="partners/profile/",null=True,blank=True)
    address=models.TextField(blank=True); city=models.CharField(max_length=80,blank=True); district=models.CharField(max_length=80,blank=True)
    state=models.CharField(max_length=80,blank=True); pincode=models.CharField(max_length=10,blank=True)
    languages=models.JSONField(default=list,blank=True); emergency_contact=models.CharField(max_length=20,blank=True)
    experience=models.CharField(max_length=80,blank=True); team_size=models.PositiveIntegerField(default=1)
    service_areas=models.JSONField(default=list,blank=True)
    max_travel_km=models.DecimalField(max_digits=6,decimal_places=2,default=10,validators=[MinValueValidator(0)])
    working_days=models.JSONField(default=list,blank=True); start_time=models.TimeField(null=True,blank=True); end_time=models.TimeField(null=True,blank=True)
    blackout_dates=models.JSONField(default=list,blank=True); equipment=models.JSONField(default=dict,blank=True)
    bank_holder=models.CharField(max_length=160,blank=True); bank_name=models.CharField(max_length=160,blank=True)
    bank_account_masked=models.CharField(max_length=40,blank=True); ifsc=models.CharField(max_length=20,blank=True)
    agreement_version=models.CharField(max_length=40,blank=True); agreement_accepted_at=models.DateTimeField(null=True,blank=True)
    status=models.CharField(max_length=30,choices=Status.choices,default=Status.DRAFT)
    application_reference=models.CharField(max_length=30,unique=True,null=True,blank=True)
    review_reason=models.TextField(blank=True); created_at=models.DateTimeField(auto_now_add=True); updated_at=models.DateTimeField(auto_now=True)
    def __str__(self): return f"{self.display_name or self.legal_name} ({self.status})"

class PartnerService(models.Model):
    partner=models.ForeignKey(PartnerProfile,on_delete=models.CASCADE,related_name="partner_services")
    service_slug=models.CharField(max_length=120)
    is_approved=models.BooleanField(default=False)
    admin_note=models.TextField(blank=True)
    approved_at=models.DateTimeField(null=True,blank=True)
    class Meta: unique_together=("partner","service_slug")

class PartnerDocument(models.Model):
    class DocType(models.TextChoices):
        IDENTITY="IDENTITY","Identity Proof"; PAN="PAN","PAN"; ADDRESS="ADDRESS","Address Proof"; BANK="BANK","Bank Proof"
        GST="GST","GST"; BUSINESS="BUSINESS","Business Registration"; VEHICLE="VEHICLE","Vehicle"; CERTIFICATE="CERTIFICATE","Certificate"; OTHER="OTHER","Other"
    class Verification(models.TextChoices):
        PENDING="PENDING","Pending"; VERIFIED="VERIFIED","Verified"; REJECTED="REJECTED","Rejected"; CORRECTION="CORRECTION","Correction Required"
    partner=models.ForeignKey(PartnerProfile,on_delete=models.CASCADE,related_name="documents")
    document_type=models.CharField(max_length=30,choices=DocType.choices)
    file=models.FileField(upload_to="partners/private_documents/", storage=private_storage)
    verification_status=models.CharField(max_length=20,choices=Verification.choices,default=Verification.PENDING)
    review_reason=models.TextField(blank=True); created_at=models.DateTimeField(auto_now_add=True); updated_at=models.DateTimeField(auto_now=True)

class PartnerApproval(models.Model):
    class Action(models.TextChoices):
        SUBMITTED="SUBMITTED","Submitted"; APPROVED="APPROVED","Approved"; REJECTED="REJECTED","Rejected"; MORE_INFO="MORE_INFO","More Information"; SUSPENDED="SUSPENDED","Suspended"
    partner=models.ForeignKey(PartnerProfile,on_delete=models.CASCADE,related_name="approval_history")
    actor=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name="partner_actions")
    action=models.CharField(max_length=30,choices=Action.choices); reason=models.TextField(blank=True); created_at=models.DateTimeField(auto_now_add=True)

class PartnerAvailability(models.Model):
    partner=models.OneToOneField(PartnerProfile,on_delete=models.CASCADE,related_name="availability")
    is_available=models.BooleanField(default=True); schedule=models.JSONField(default=dict,blank=True); blackout_dates=models.JSONField(default=list,blank=True)
    max_jobs_per_day=models.PositiveIntegerField(default=5); travel_buffer_minutes=models.PositiveIntegerField(default=30)

class PartnerBooking(models.Model):
    class Status(models.TextChoices):
        OFFERED="OFFERED","Offered"; ACCEPTED="ACCEPTED","Accepted"; EN_ROUTE="EN_ROUTE","En Route"; ARRIVED="ARRIVED","Arrived"
        IN_PROGRESS="IN_PROGRESS","In Progress"; COMPLETED="COMPLETED","Completed"; CUSTOMER_UNAVAILABLE="CUSTOMER_UNAVAILABLE","Customer Unavailable"
        ISSUE="ISSUE","Issue Reported"; CANCELLED="CANCELLED","Cancelled"
    partner=models.ForeignKey(PartnerProfile,on_delete=models.PROTECT,related_name="bookings")
    booking_reference=models.CharField(max_length=40,unique=True)
    service_name=models.CharField(max_length=160); customer_name=models.CharField(max_length=160,blank=True)
    customer_address=models.TextField(blank=True); scheduled_at=models.DateTimeField()
    amount=models.DecimalField(max_digits=10,decimal_places=2); status=models.CharField(max_length=30,choices=Status.choices,default=Status.OFFERED)
    started_at=models.DateTimeField(null=True,blank=True); completed_at=models.DateTimeField(null=True,blank=True); notes=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)

class PartnerPayout(models.Model):
    class Status(models.TextChoices):
        PENDING="PENDING","Pending"; PROCESSING="PROCESSING","Processing"; PAID="PAID","Paid"; FAILED="FAILED","Failed"; HOLD="ON_HOLD","On Hold"; REVERSED="REVERSED","Reversed"
    partner=models.ForeignKey(PartnerProfile,on_delete=models.PROTECT,related_name="payouts")
    reference=models.CharField(max_length=40,unique=True); amount=models.DecimalField(max_digits=10,decimal_places=2)
    status=models.CharField(max_length=20,choices=Status.choices,default=Status.PENDING); payout_date=models.DateTimeField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)

class PartnerSupportTicket(models.Model):
    partner=models.ForeignKey(PartnerProfile,on_delete=models.CASCADE,related_name="support_tickets")
    category=models.CharField(max_length=80); description=models.TextField(); booking_reference=models.CharField(max_length=40,blank=True)
    status=models.CharField(max_length=30,default="OPEN"); created_at=models.DateTimeField(auto_now_add=True); updated_at=models.DateTimeField(auto_now=True)
