import secrets

from django.db import transaction
from django.db.models import Q, Sum
from django.http import FileResponse, Http404
from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from partners.models import PartnerApproval, PartnerDocument, PartnerProfile
from .models import Offer
from .serializers import AdminPartnerCreateSerializer, AdminServiceSerializer, OfferSerializer
from partners.models import PartnerInvoice
from partners.serializers import PartnerInvoiceSerializer
from services.models import Service

from .permissions import IsAdminUser


class AdminBaseView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]


class PublicOffersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today = timezone.localdate()
        offers = Offer.objects.filter(
            is_active=True,
            show_on_homepage=True,
        ).filter(
            Q(valid_from__isnull=True) | Q(valid_from__lte=today),
            Q(valid_to__isnull=True) | Q(valid_to__gte=today),
        )
        return Response(OfferSerializer(offers, many=True).data)


class AdminOffersView(AdminBaseView):
    def get(self, request):
        offers = Offer.objects.all()
        return Response(OfferSerializer(offers, many=True).data)

    def post(self, request):
        serializer = OfferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


class AdminOfferDetailView(AdminBaseView):
    def get_object(self, pk):
        return Offer.objects.filter(pk=pk).first()

    def get(self, request, pk):
        offer = self.get_object(pk)
        if offer is None:
            return Response({"detail": "Offer not found."}, status=404)
        return Response(OfferSerializer(offer).data)

    def patch(self, request, pk):
        offer = self.get_object(pk)
        if offer is None:
            return Response({"detail": "Offer not found."}, status=404)
        serializer = OfferSerializer(offer, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        offer = self.get_object(pk)
        if offer is None:
            return Response({"detail": "Offer not found."}, status=404)
        offer.is_active = False
        offer.save(update_fields=["is_active", "updated_at"])
        return Response(status=204)


def user_name(user):
    return (
        f"{user.first_name} {user.last_name}"
    ).strip() or user.username or user.email


# ============================================================
# DASHBOARD
# ============================================================

class AdminDashboardView(AdminBaseView):
    def get(self, request):
        customers = User.objects.filter(
            role=User.Role.CUSTOMER,
            is_active=True,
        ).count()

        partners = PartnerProfile.objects.filter(
            status=PartnerProfile.Status.APPROVED,
        ).count()

        return Response({
            "total_bookings": 0,
            "total_revenue": 0,
            "active_customers": customers,
            "active_partners": partners,
            "partner_logins": (
                PartnerProfile.objects.aggregate(total=Sum("login_count"))["total"] or 0
            ),
            "booking_trend": [],
            "status_counts": {},
        })


# ============================================================
# CUSTOMERS
# ============================================================

class AdminCustomersView(AdminBaseView):
    def get(self, request):
        users = User.objects.filter(
            role=User.Role.CUSTOMER
        ).order_by("-created_at")

        return Response([
            {
                "id": getattr(user, "id", None),
                "name": user_name(user),
                "email": user.email,
                "phone": user.phone,
                "booking_count": 0,
                "total_spend": 0,
                "is_active": user.is_active,
                "date_joined": (
                    user.created_at.isoformat()
                    if user.created_at
                    else None
                ),
            }
            for user in users
        ])


class AdminCustomerDetailView(AdminBaseView):
    def get(self, request, pk):
        user = User.objects.filter(
            pk=pk,
            role=User.Role.CUSTOMER,
        ).first()

        if not user:
            return Response(
                {"detail": "Customer not found."},
                status=404,
            )

        return Response({
            "id": getattr(user, "id", None),
            "name": user_name(user),
            "email": user.email,
            "phone": user.phone,
            "username": user.username,
            "role": user.role,
            "is_active": user.is_active,
            "is_phone_verified": user.is_phone_verified,
            "created_at": (
                user.created_at.isoformat()
                if user.created_at
                else None
            ),
        })


# ============================================================
# CLEANING PARTNERS
# ============================================================

class AdminPartnersView(AdminBaseView):
    def get(self, request):
        partners = PartnerProfile.objects.select_related(
            "user"
        ).order_by("-created_at")

        return Response([
            {
                "id": getattr(partner, "id", None),
                "name": (
                    partner.display_name
                    or partner.legal_name
                ),
                "email": (
                    partner.email
                    or partner.user.email
                ),
                "phone": (
                    partner.phone
                    or partner.user.phone
                ),
                "location": ", ".join(
                    x
                    for x in [
                        partner.city,
                        partner.state,
                    ]
                    if x
                ),
                "status": partner.status,
                "total_jobs": (
                    getattr(partner, "bookings").count()
                ),
                "rating": None,
                "application_reference": (
                    partner.application_reference
                ),
            }
            for partner in partners
        ])

    @transaction.atomic
    def post(self, request):
        serializer = AdminPartnerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        username = f"partner_{secrets.token_hex(8)}"
        temporary_password = secrets.token_urlsafe(18)
        user = User.objects.create_user(
            username=username,
            email=data["email"],
            password=temporary_password,
            phone=data["phone"],
            role=User.Role.PARTNER,
        )
        partner = PartnerProfile.objects.create(
            user=user,
            legal_name=data["legal_name"].strip(),
            display_name=(
                data.get("display_name", "").strip()
                or data["legal_name"].strip()
            ),
            business_name=data.get("business_name", "").strip(),
            email=data["email"],
            phone=data["phone"],
            partner_type=data["partner_type"],
            city=data.get("city", "").strip(),
            state=data.get("state", "").strip(),
            status=PartnerProfile.Status.APPROVED,
            application_reference=f"CKP-{secrets.token_hex(4).upper()}",
        )
        PartnerApproval.objects.create(
            partner=partner,
            actor=request.user,
            action=PartnerApproval.Action.APPROVED,
            reason="Partner account created and approved by an administrator.",
        )

        return Response(
            {
                "id": partner.id,
                "name": partner.display_name or partner.legal_name,
                "email": user.email,
                "phone": partner.phone,
                "status": partner.status,
                "application_reference": partner.application_reference,
                "temporary_password": temporary_password,
                "message": (
                    "Partner account created. The temporary password is shown "
                    "only in this response; share it securely with the partner."
                ),
            },
            status=201,
        )


class AdminPartnerDetailView(AdminBaseView):
    def get(self, request, pk):
        partner = PartnerProfile.objects.select_related(
            "user"
        ).filter(pk=pk).first()

        if not partner:
            return Response(
                {"detail": "Partner not found."},
                status=404,
            )

        return Response({
            "id": getattr(partner, "id", None),
            "name": (
                partner.display_name
                or partner.legal_name
            ),
            "legal_name": partner.legal_name,
            "business_name": partner.business_name,
            "email": (
                partner.email
                or partner.user.email
            ),
            "phone": partner.phone,
            "location": ", ".join(
                x
                for x in [
                    partner.city,
                    partner.state,
                    partner.pincode,
                ]
                if x
            ),
            "status": partner.status,
            "billing_blocked": partner.billing_blocked,
            "application_reference": (
                partner.application_reference
            ),
            "partner_type": partner.partner_type,
            "date_of_birth": partner.date_of_birth,
            "gender": partner.gender,
            "profile_photo": partner.profile_photo.url if partner.profile_photo else "",
            "address": partner.address,
            "city": partner.city,
            "district": partner.district,
            "state": partner.state,
            "pincode": partner.pincode,
            "languages": partner.languages,
            "emergency_contact": partner.emergency_contact,
            "experience": partner.experience,
            "team_size": partner.team_size,
            "max_travel_km": partner.max_travel_km,
            "working_days": partner.working_days,
            "start_time": partner.start_time,
            "end_time": partner.end_time,
            "blackout_dates": partner.blackout_dates,
            "service_areas": partner.service_areas,
            "equipment": partner.equipment,
            "bank_holder": partner.bank_holder,
            "bank_name": partner.bank_name,
            "bank_account_masked": partner.bank_account_masked,
            "ifsc": partner.ifsc,
            "agreement_version": partner.agreement_version,
            "agreement_accepted_at": partner.agreement_accepted_at,
            "review_reason": partner.review_reason,
            "created_at": partner.created_at,
            "services": list(
                partner.partner_services.values(
                    "id",
                    "service_slug",
                    "is_approved",
                )
            ),
            "documents": list(
                partner.documents.values(
                    "id",
                    "document_type",
                    "verification_status",
                    "review_reason",
                    "created_at",
                )
            ),
            "approval_history": list(
                partner.approval_history.select_related("actor").values(
                    "action",
                    "reason",
                    "created_at",
                    "actor__email",
                )
            ),
            "total_jobs": (
                getattr(partner, "bookings").count()
            ),
        })


class AdminPartnerActionView(AdminBaseView):
    @transaction.atomic
    def post(self, request, pk):
        partner = PartnerProfile.objects.select_for_update().filter(pk=pk).first()
        if partner is None:
            return Response({"detail": "Partner not found."}, status=404)

        action = request.data.get("action")
        status_by_action = {
            "approve": PartnerProfile.Status.APPROVED,
            "reject": PartnerProfile.Status.REJECTED,
            "request-info": PartnerProfile.Status.MORE_INFO,
            "suspend": PartnerProfile.Status.SUSPENDED,
            "unblock": PartnerProfile.Status.APPROVED,
        }
        new_status = status_by_action.get(action)
        if new_status is None:
            return Response({"detail": "Invalid partner review action."}, status=400)

        reviewable_statuses = {
            PartnerProfile.Status.SUBMITTED,
            PartnerProfile.Status.UNDER_REVIEW,
            PartnerProfile.Status.MORE_INFO,
        }
        if action in {"approve", "reject", "request-info"}:
            if partner.status not in reviewable_statuses:
                return Response(
                    {"detail": "Only submitted applications can be reviewed."},
                    status=400,
                )
        elif action == "suspend" and partner.status != PartnerProfile.Status.APPROVED:
            return Response(
                {"detail": "Only approved partners can be blocked."},
                status=400,
            )
        elif action == "unblock" and partner.status != PartnerProfile.Status.SUSPENDED:
            return Response(
                {"detail": "Only blocked partners can be unblocked."},
                status=400,
            )

        reason = (request.data.get("reason") or "").strip()
        if action in {"reject", "request-info", "suspend"} and not reason:
            return Response(
                {"detail": "A reason is required for this action."},
                status=400,
            )

        partner.status = new_status
        partner.review_reason = reason
        partner.save(update_fields=["status", "review_reason", "updated_at"])
        PartnerApproval.objects.create(
            partner=partner,
            actor=request.user,
            action=new_status,
            reason=reason,
        )
        return Response({
            "id": partner.id,
            "status": partner.status,
            "review_reason": partner.review_reason,
        })


class AdminPartnerDocumentDownloadView(AdminBaseView):
    def get(self, request, pk, document_id):
        document = PartnerDocument.objects.filter(
            partner_id=pk,
            pk=document_id,
        ).first()
        if document is None:
            raise Http404
        return FileResponse(
            document.file.open("rb"),
            as_attachment=True,
            filename=document.file.name.split("/")[-1],
        )


class AdminPartnerInvoicesView(AdminBaseView):
    def get(self, request, pk):
        partner = PartnerProfile.objects.filter(pk=pk).first()
        if not partner:
            return Response({"detail": "Partner not found."}, status=404)
        invoices = partner.invoices.order_by("-created_at")
        return Response(PartnerInvoiceSerializer(invoices, many=True).data)

    def post(self, request, pk):
        partner = PartnerProfile.objects.filter(pk=pk).first()
        if not partner:
            return Response({"detail": "Partner not found."}, status=404)
        serializer = PartnerInvoiceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.save(
            partner=partner,
            created_by=request.user,
            reference=f"CKI-{secrets.token_hex(4).upper()}",
        )
        return Response(PartnerInvoiceSerializer(invoice).data, status=201)


class AdminPartnerInvoicePaymentView(AdminBaseView):
    def post(self, request, invoice_id):
        invoice = PartnerInvoice.objects.filter(pk=invoice_id).first()
        if not invoice:
            return Response({"detail": "Invoice not found."}, status=404)
        if invoice.status != PartnerInvoice.Status.UNPAID:
            return Response({"detail": "Only unpaid invoices can be marked paid."}, status=400)
        invoice.status = PartnerInvoice.Status.PAID
        invoice.payment_reference = (request.data.get("payment_reference") or "").strip()
        invoice.paid_at = timezone.now()
        invoice.save(update_fields=["status", "payment_reference", "paid_at", "updated_at"])
        return Response(PartnerInvoiceSerializer(invoice).data)


# ============================================================
# SERVICES
# ============================================================

class AdminServicesView(AdminBaseView):
    def get(self, request):
        services = Service.objects.select_related(
            "category"
        ).order_by(
            "display_order",
            "name",
        )

        return Response([
            {
                "id": getattr(service, "id", None),
                "name": service.name,
                "slug": service.slug,
                "category": service.category.name,
                "base_price": float(service.price),
                "min_price": float(service.price),
                "max_price": float(
                    service.max_price
                    if service.max_price is not None
                    else service.price
                ),
                "duration": service.duration_minutes,
                "is_active": service.is_active,
                "image": service_image_url(service, request),
            }
            for service in services
        ])

    @transaction.atomic
    def post(self, request):
        serializer = AdminServiceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = serializer.save()
        return Response(admin_service_detail(service, request), status=201)


class AdminServiceDetailView(AdminBaseView):

    def get(self, request, pk):
        service = Service.objects.select_related(
            "category"
        ).filter(pk=pk).first()

        if not service:
            return Response(
                {"detail": "Service not found."},
                status=404,
            )

        return Response(admin_service_detail(service, request))

    @transaction.atomic
    def patch(self, request, pk):
        service = Service.objects.filter(
            pk=pk
        ).first()

        if not service:
            return Response(
                {"detail": "Service not found."},
                status=404,
            )

        serializer = AdminServiceSerializer(
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        service = serializer.save(instance=service)
        return Response(admin_service_detail(service, request))

    def delete(self, request, pk):
        service = Service.objects.filter(pk=pk).first()
        if service is None:
            return Response({"detail": "Service not found."}, status=404)
        service.is_active = False
        service.save(update_fields=["is_active", "updated_at"])
        return Response(
            {"id": service.id, "is_active": False, "message": "Service removed from the website."}
        )


def service_image_url(service, request):
    image = service.images.filter(is_primary=True).first() or service.images.first()
    if image is None or not image.image:
        return None
    url = image.image.url
    return request.build_absolute_uri(url)


def admin_service_detail(service, request):
    return {
        "id": service.id,
        "name": service.name,
        "slug": service.slug,
        "category": service.category.name,
        "base_price": float(service.price),
        "min_price": float(service.price),
        "max_price": float(service.max_price if service.max_price is not None else service.price),
        "duration": service.duration_minutes,
        "is_active": service.is_active,
        "short_description": service.short_description,
        "description": service.description,
        "features": service.features,
        "addons": service.addons,
        "is_top_service": service.is_top_service,
        "image": service_image_url(service, request),
    }


# ============================================================
# PLACEHOLDER ADMIN MODULES
# ============================================================

class EmptyAdminListView(AdminBaseView):

    def get(self, request):
        return Response([])

    def post(self, request):
        return Response(
            {
                "detail": (
                    "This module is connected to the "
                    "Admin Portal, but its business model "
                    "is not implemented yet."
                )
            },
            status=501,
        )


# ============================================================
# REPORTS
# ============================================================

class AdminReportsView(AdminBaseView):
    def get(self, request):
        customers = User.objects.filter(
            role=User.Role.CUSTOMER,
            is_active=True,
        ).count()

        partners = PartnerProfile.objects.filter(
            status=PartnerProfile.Status.APPROVED,
        ).count()

        return Response({
            "total_bookings": 0,
            "total_revenue": 0,
            "active_customers": customers,
            "active_partners": partners,
            "daily": [],
        })