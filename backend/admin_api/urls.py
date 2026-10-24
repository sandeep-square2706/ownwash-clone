from django.urls import path

from .views import (
    AdminDashboardView,
    AdminCustomerDetailView,
    AdminCustomersView,
    AdminPartnerDetailView,
    AdminPartnersView,
    AdminReportsView,
    AdminServiceDetailView,
    AdminServicesView,
    EmptyAdminListView,
)

urlpatterns = [
    # Dashboard
    path(
        "dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard",
    ),

    # Customers
    path(
        "customers/",
        AdminCustomersView.as_view(),
        name="admin-customers",
    ),
    path(
        "customers/<int:pk>/",
        AdminCustomerDetailView.as_view(),
        name="admin-customer-detail",
    ),

    # Cleaning Partners
    path(
        "partners/",
        AdminPartnersView.as_view(),
        name="admin-partners",
    ),
    path(
        "partners/<int:pk>/",
        AdminPartnerDetailView.as_view(),
        name="admin-partner-detail",
    ),

    # Services
    path(
        "services/",
        AdminServicesView.as_view(),
        name="admin-services",
    ),
    path(
        "services/<int:pk>/",
        AdminServiceDetailView.as_view(),
        name="admin-service-detail",
    ),

    # Modules whose business models are not implemented yet
    path("bookings/", EmptyAdminListView.as_view(), name="admin-bookings"),
    path("bookings/<int:pk>/", EmptyAdminListView.as_view(), name="admin-booking-detail"),

    path("payments/", EmptyAdminListView.as_view(), name="admin-payments"),
    path("payments/<int:pk>/", EmptyAdminListView.as_view(), name="admin-payment-detail"),

    path("refunds/", EmptyAdminListView.as_view(), name="admin-refunds"),

    path("reviews/", EmptyAdminListView.as_view(), name="admin-reviews"),

    path("complaints/", EmptyAdminListView.as_view(), name="admin-complaints"),

    path("offers/", EmptyAdminListView.as_view(), name="admin-offers"),

    path("banners/", EmptyAdminListView.as_view(), name="admin-banners"),

    path("notifications/", EmptyAdminListView.as_view(), name="admin-notifications"),

    # Reports
    path(
        "reports/",
        AdminReportsView.as_view(),
        name="admin-reports",
    ),
]