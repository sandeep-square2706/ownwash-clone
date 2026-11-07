from django.urls import path

from .views import (
    AddressDetailView,
    AddressListCreateView,
    LoginView,
    ProfileView,
    RegisterView,
    ResendEmailVerificationView,
    SetDefaultAddressView,
    VerifyEmailView,
)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "verify-email/",
        VerifyEmailView.as_view(),
        name="verify-email",
    ),

    path(
        "resend-verification/",
        ResendEmailVerificationView.as_view(),
        name="resend-verification",
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),

    # Address management
    path(
        "addresses/",
        AddressListCreateView.as_view(),
        name="address-list-create",
    ),

    path(
        "addresses/<int:pk>/",
        AddressDetailView.as_view(),
        name="address-detail",
    ),

    path(
        "addresses/<int:pk>/default/",
        SetDefaultAddressView.as_view(),
        name="address-set-default",
    ),
]