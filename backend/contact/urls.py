from django.urls import path

from .views import (
    AdminContactMessageDetailView,
    AdminContactMessageListView,
    ContactMessageCreateView,
)

urlpatterns = [
    path("", ContactMessageCreateView.as_view()),
    path("admin/", AdminContactMessageListView.as_view()),
    path("admin/<int:pk>/", AdminContactMessageDetailView.as_view()),
]