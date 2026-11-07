from django.urls import path

from .views import (
    BookingDetailView,
    BookingListCreateView,
    CouponValidationView,
    FirstOrderOfferView,
)


urlpatterns = [
    path(
        "first-order-offer/",
        FirstOrderOfferView.as_view(),
        name="first-order-offer",
    ),
    path(
        "validate-coupon/",
        CouponValidationView.as_view(),
        name="validate-coupon",
    ),
    path(
        "",
        BookingListCreateView.as_view(),
        name="booking-list-create",
    ),
    path(
        "<int:pk>/",
        BookingDetailView.as_view(),
        name="booking-detail",
    ),
]