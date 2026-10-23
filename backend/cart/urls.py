from django.urls import path

from .views import (
    CartItemCreateView,
    CartItemDetailView,
    CartView,
)


urlpatterns = [
    path(
        "",
        CartView.as_view(),
        name="cart",
    ),

    path(
        "items/",
        CartItemCreateView.as_view(),
        name="cart-item-create",
    ),

    path(
        "items/<int:item_id>/",
        CartItemDetailView.as_view(),
        name="cart-item-detail",
    ),
]