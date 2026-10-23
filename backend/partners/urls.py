from django.urls import path
from .views import *
urlpatterns=[
 path("register/",PartnerRegisterView.as_view()),
 path("login/otp/request/",PartnerOtpRequestView.as_view()),
 path("login/otp/verify/",PartnerOtpVerifyView.as_view()),
 path("me/",PartnerMeView.as_view()),
 path("status/",PartnerStatusView.as_view()),
 path("documents/",PartnerDocumentListCreateView.as_view()),
 path("documents/<int:document_id>/download/",PartnerDocumentDownloadView.as_view()),
 path("submit/",PartnerSubmitView.as_view()),
 path("availability/",PartnerAvailabilityView.as_view()),
 path("bookings/",PartnerBookingsView.as_view()),
 path("bookings/<int:pk>/",PartnerBookingDetailView.as_view()),
 path("earnings/",PartnerEarningsView.as_view()),
 path("payouts/",PartnerPayoutsView.as_view()),
 path("support/",PartnerSupportView.as_view()),
 path("admin/partners/",AdminPartnerListView.as_view()),
 path("admin/partners/<int:partner_id>/action/",AdminPartnerActionView.as_view()),
]
