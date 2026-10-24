from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication
    path(
        "api/auth/",
        include("accounts.urls"),
    ),
    path(
        "api/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # Services
    path(
        "api/",
        include("services.urls"),
    ),

    # Cart
    path(
        "api/cart/",
        include("cart.urls"),
    ),

    # Partners and administration
    path(
        "api/partners/",
        include("partners.urls"),
    ),
    path(
        "api/admin/",
        include("admin_api.urls"),
    ),

    # Contact and reviews
    path(
        "api/contact/",
        include("contact.urls"),
    ),
    path(
        "api/reviews/",
        include("reviews.urls"),
    ),

    # Bookings and payments
    path(
        "api/bookings/",
        include("bookings.urls"),
    ),
    path(
        "api/payments/",
        include("payments.urls"),
    ),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )