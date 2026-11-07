from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from services.models import Service

from .models import PartnerService
from .permissions import IsPartner


class PartnerServicesView(APIView):
    """Return the active catalogue and this partner's service requests.

    Partners can request or deselect services, but they cannot approve them.
    Only CleanKart staff can set PartnerService.is_approved.
    """
    permission_classes = [permissions.IsAuthenticated, IsPartner]

    def _response_data(self, partner):
        records = {
            row.service_slug: row
            for row in PartnerService.objects.filter(partner=partner)
        }
        services = Service.objects.filter(is_active=True).order_by("name")
        return [
            {
                "slug": service.slug,
                "name": service.name,
                "selected": service.slug in records,
                "is_approved": records[service.slug].is_approved
                if service.slug in records else False,
            }
            for service in services
        ]

    def get(self, request):
        partner = request.user.partner_profile
        return Response(self._response_data(partner))

    def put(self, request):
        partner = request.user.partner_profile
        requested = request.data.get("services")
        if not isinstance(requested, list) or not all(
            isinstance(slug, str) and slug.strip() for slug in requested
        ):
            return Response(
                {"detail": "services must be a list of service slugs."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        requested_slugs = {slug.strip() for slug in requested}
        available_slugs = set(
            Service.objects.filter(is_active=True, slug__in=requested_slugs)
            .values_list("slug", flat=True)
        )
        unknown = sorted(requested_slugs - available_slugs)
        if unknown:
            return Response(
                {"detail": "One or more selected services are unavailable.", "unknown_services": unknown},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for slug in requested_slugs:
            PartnerService.objects.get_or_create(
                partner=partner,
                service_slug=slug,
            )

        # A partner may withdraw an unapproved request, but cannot remove
        # a service that CleanKart has already approved.
        PartnerService.objects.filter(
            partner=partner,
            is_approved=False,
        ).exclude(service_slug__in=requested_slugs).delete()

        return Response(self._response_data(partner))
