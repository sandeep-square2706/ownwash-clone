from typing import Any

from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    message = "Admin access is required."

    def has_permission(self, request: Any, view: Any) -> Any:
        return (
            request.user is not None
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "ADMIN"
        )