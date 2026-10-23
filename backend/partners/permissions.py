from rest_framework.permissions import BasePermission
from accounts.models import User

class IsPartner(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user,"role",None)==User.Role.PARTNER)

class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)
