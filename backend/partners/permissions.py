from rest_framework.permissions import BasePermission
from accounts.models import User
from .models import PartnerProfile

class IsPartner(BasePermission):
    def has_permission(self, request, view):
        if not (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == User.Role.PARTNER
            and getattr(request.user, "partner_profile", None)
        ):
            return False

        partner = request.user.partner_profile
        if partner.status == PartnerProfile.Status.SUSPENDED:
            self.message = "This partner account is blocked. Contact Zaapino support."
            return False
        if partner.billing_blocked and not request.path.endswith(("/me/", "/billing/")):
            self.message = "Partner access is blocked because an invoice is overdue. Open billing to resolve it."
            return False
        return True

class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)
