from django.urls import path

from .views import (
    AdminDashboardView,
    AdminOfferDetailView,
    AdminOffersView,
    AdminCustomerDetailView,
    AdminCustomersView,
    AdminPartnerActionView,
    AdminPartnerDetailView,
    AdminPartnerDocumentDownloadView,
    AdminPartnerInvoicesView,
    AdminPartnerInvoicePaymentView,
    AdminPartnersView,
    AdminReportsView,
    AdminServiceDetailView,
    AdminServicesView,
    EmptyAdminListView,
)
from payments.views import (
    AdminDirectUpiReviewView,
    AdminPaymentDetailView,
    AdminPaymentListView,
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
    path(
        "partners/<int:pk>/action/",
        AdminPartnerActionView.as_view(),
        name="admin-partner-action",
    ),
    path(
        "partners/<int:pk>/documents/<int:document_id>/download/",
        AdminPartnerDocumentDownloadView.as_view(),
        name="admin-partner-document-download",
    ),
    path(
        "partners/<int:pk>/invoices/",
        AdminPartnerInvoicesView.as_view(),
        name="admin-partner-invoices",
    ),
    path(
        "partner-invoices/<int:invoice_id>/mark-paid/",
        AdminPartnerInvoicePaymentView.as_view(),
        name="admin-partner-invoice-mark-paid",
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

    path("payments/", AdminPaymentListView.as_view(), name="admin-payments"),
    path("payments/<int:pk>/", AdminPaymentDetailView.as_view(), name="admin-payment-detail"),
    path(
        "payments/<int:pk>/upi-review/",
        AdminDirectUpiReviewView.as_view(),
        name="admin-payment-upi-review",
    ),

    path("refunds/", EmptyAdminListView.as_view(), name="admin-refunds"),

    path("reviews/", EmptyAdminListView.as_view(), name="admin-reviews"),

    path("complaints/", EmptyAdminListView.as_view(), name="admin-complaints"),

    path("offers/", AdminOffersView.as_view(), name="admin-offers"),
    path("offers/<int:pk>/", AdminOfferDetailView.as_view(), name="admin-offer-detail"),

    path("banners/", EmptyAdminListView.as_view(), name="admin-banners"),

    path("notifications/", EmptyAdminListView.as_view(), name="admin-notifications"),

    # Reports
    path(
        "reports/",
        AdminReportsView.as_view(),
        name="admin-reports",
    ),
]