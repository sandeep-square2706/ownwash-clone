from decimal import Decimal

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from partners.models import PartnerProfile
from services.models import Service

from .permissions import IsAdminUser


class AdminBaseView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]


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
            "application_reference": (
                partner.application_reference
            ),
            "experience": partner.experience,
            "team_size": partner.team_size,
            "service_areas": partner.service_areas,
            "total_jobs": (
                getattr(partner, "bookings").count()
            ),
        })


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
                "image": None,
            }
            for service in services
        ])


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

        return Response({
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
            "short_description": service.short_description,
            "description": service.description,
            "features": service.features,
            "addons": service.addons,
            "is_top_service": service.is_top_service,
        })

    def patch(self, request, pk):
        service = Service.objects.filter(
            pk=pk
        ).first()

        if not service:
            return Response(
                {"detail": "Service not found."},
                status=404,
            )

        # ----------------------------------------------------
        # SERVICE NAME
        # ----------------------------------------------------

        if "name" in request.data:
            name = str(
                request.data["name"]
            ).strip()

            if not name:
                return Response(
                    {
                        "name":
                        "Service name cannot be empty."
                    },
                    status=400,
                )

            service.name = name

        # ----------------------------------------------------
        # BASE PRICE
        # ----------------------------------------------------

        if "base_price" in request.data:
            try:
                price = Decimal(
                    str(request.data["base_price"])
                )

                if price < 0:
                    raise ValueError

                service.price = price

            except (
                TypeError,
                ValueError,
                ArithmeticError,
            ):
                return Response(
                    {
                        "base_price":
                        "Enter a valid non-negative price."
                    },
                    status=400,
                )

        # ----------------------------------------------------
        # ACTIVE STATUS
        # ----------------------------------------------------

        if "is_active" in request.data:
            value = request.data["is_active"]

            if isinstance(value, bool):
                service.is_active = value

            elif str(value).lower() in [
                "true",
                "1",
                "yes",
                "on",
            ]:
                service.is_active = True

            elif str(value).lower() in [
                "false",
                "0",
                "no",
                "off",
            ]:
                service.is_active = False

            else:
                return Response(
                    {
                        "is_active":
                        "Enter a valid boolean value."
                    },
                    status=400,
                )

        service.save()

        return Response({
            "id": getattr(service, "id", None),
            "name": service.name,
            "base_price": float(service.price),
            "is_active": service.is_active,
            "message": "Service updated successfully.",
        })


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