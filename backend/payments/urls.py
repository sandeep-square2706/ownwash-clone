from django.urls import path

from .views import (
    CreateRazorpayOrderView,
    DirectUpiConfigView,
    SubmitDirectUpiPaymentView,
    VerifyRazorpayPaymentView,
)


urlpatterns = [
    path(
        "upi/config/",
        DirectUpiConfigView.as_view(),
        name="direct-upi-config",
    ),
    path(
        "upi/submit/",
        SubmitDirectUpiPaymentView.as_view(),
        name="direct-upi-submit",
    ),
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