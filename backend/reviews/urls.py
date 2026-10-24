from django.urls import path

from .views import (
    AdminReviewDetailView,
    AdminReviewListView,
    ApprovedReviewListView,
    ReviewCreateView,
)

urlpatterns = [
    path("", ReviewCreateView.as_view()),
    path("approved/", ApprovedReviewListView.as_view()),
    path("admin/", AdminReviewListView.as_view()),
    path("admin/<int:pk>/", AdminReviewDetailView.as_view()),
]