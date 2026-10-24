from django.urls import path

from .views import (
    CreateRazorpayOrderView,
    VerifyRazorpayPaymentView,
)


urlpatterns = [
    path(
        "create-order/",
        CreateRazorpayOrderView.as_view(),
        name="razorpay-create-order",
    ),
    path(
        "verify/",
        VerifyRazorpayPaymentView.as_view(),
        name="razorpay-verify-payment",
    ),
]