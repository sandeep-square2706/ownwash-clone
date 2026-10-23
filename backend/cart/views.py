from decimal import Decimal
from typing import Any, cast

from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .cart_serializers import (
    AddCartItemSerializer,
    CartItemSerializer,
    CartSerializer,
)
from .models import Cart, CartItem


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user: Any) -> Cart:
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request: Request) -> Response:
        cart = self.get_cart(request.user)

        serializer = CartSerializer(
            cart,
            context={"request": request},
        )

        return Response(serializer.data)

    def delete(self, request: Request) -> Response:
        cart = self.get_cart(request.user)

        CartItem.objects.filter(cart=cart).delete()

        return Response(
            {"message": "Cart cleared successfully."},
            status=status.HTTP_200_OK,
        )


class CartItemCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request: Request) -> Response:
        serializer = AddCartItemSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        data: Any = serializer.validated_data

        service: Any = data["service"]
        variant: Any = data.get("variant")

        selected_addons: list[Any] = data.get(
            "selected_addons",
            [],
        )

        quantity: int = int(
            data.get(
                "quantity",
                1,
            )
        )

        cart, _ = Cart.objects.get_or_create(
            user=request.user,
        )

        # -----------------------------------------
        # Calculate authoritative base price
        # -----------------------------------------

        if variant is not None:
            base_price = variant.price
        else:
            base_price = service.price

        # -----------------------------------------
        # Calculate selected add-on total
        # -----------------------------------------

        addon_total = Decimal("0.00")

        selected_ids = {
            str(addon_id)
            for addon_id in selected_addons
        }

        service_addons = cast(
            list[dict[str, Any]],
            service.addons or [],
        )

        for addon in service_addons:
            addon_id = str(
                addon.get("id", ""),
            )

            if addon_id not in selected_ids:
                continue

            try:
                addon_total += Decimal(
                    str(
                        addon.get(
                            "price",
                            0,
                        )
                    )
                )
            except (TypeError, ValueError):
                continue

        unit_price = (
            base_price + addon_total
        )

        # -----------------------------------------
        # Find existing matching cart item
        # -----------------------------------------

        item = CartItem.objects.filter(
            cart=cart,
            service=service,
            variant=variant,
        ).first()

        if item is None:
            item = CartItem.objects.create(
                cart=cart,
                service=service,
                variant=variant,
                quantity=quantity,
                selected_addons=selected_addons,
                price_snapshot=unit_price,
            )

            created = True

        else:
            item.quantity += quantity
            item.selected_addons = selected_addons
            item.price_snapshot = unit_price

            item.save(
                update_fields=[
                    "quantity",
                    "selected_addons",
                    "price_snapshot",
                    "updated_at",
                ]
            )

            created = False

        response_serializer = CartItemSerializer(
            item,
            context={"request": request},
        )

        return Response(
            response_serializer.data,
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            ),
        )


class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_item(
        self,
        request: Request,
        item_id: int,
    ) -> CartItem | None:

        try:
            return (
                CartItem.objects
                .select_related(
                    "cart",
                    "service",
                    "variant",
                )
                .get(
                    id=item_id,
                    cart__user=request.user,
                )
            )

        except CartItem.DoesNotExist:
            return None

    def patch(
        self,
        request: Request,
        item_id: int,
    ) -> Response:

        item = self.get_item(
            request,
            item_id,
        )

        if item is None:
            return Response(
                {
                    "detail": "Cart item not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Treat DRF request data as a dictionary.
        payload = cast(
            dict[str, Any],
            request.data,
        )

        # =========================================
        # UPDATE QUANTITY
        # =========================================

        if "quantity" in payload:

            quantity_value = payload.get(
                "quantity",
            )

            if quantity_value is None:
                return Response(
                    {
                        "quantity": (
                            "Quantity is required."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                quantity = int(
                    str(quantity_value),
                )

            except (TypeError, ValueError):
                return Response(
                    {
                        "quantity": (
                            "Quantity must be "
                            "a valid integer."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if quantity < 1:
                return Response(
                    {
                        "quantity": (
                            "Quantity must be "
                            "at least 1."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            item.quantity = quantity

        # =========================================
        # UPDATE SELECTED ADD-ONS
        # =========================================

        if "selected_addons" in payload:

            selected_addons = payload.get(
                "selected_addons",
            )

            if not isinstance(
                selected_addons,
                list,
            ):
                return Response(
                    {
                        "selected_addons": (
                            "Selected add-ons "
                            "must be a list."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            service_addons = cast(
                list[dict[str, Any]],
                item.service.addons or [],
            )

            valid_addon_ids = {
                str(addon.get("id"))
                for addon in service_addons
                if addon.get("id") is not None
            }

            invalid_addons = [
                addon_id
                for addon_id in selected_addons
                if str(addon_id)
                not in valid_addon_ids
            ]

            if invalid_addons:
                return Response(
                    {
                        "selected_addons": (
                            "One or more selected "
                            "add-ons are invalid."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            item.selected_addons = (
                selected_addons
            )

        # =========================================
        # RECALCULATE AUTHORITATIVE PRICE
        # =========================================

        if item.variant is not None:
            base_price = item.variant.price
        else:
            base_price = item.service.price

        addon_total = Decimal("0.00")

        selected_ids = {
            str(addon_id)
            for addon_id in item.selected_addons
        }

        service_addons = cast(
            list[dict[str, Any]],
            item.service.addons or [],
        )

        for addon in service_addons:

            if str(addon.get("id")) not in selected_ids:
                continue

            try:
                addon_total += Decimal(
                    str(
                        addon.get(
                            "price",
                            0,
                        )
                    )
                )

            except (TypeError, ValueError):
                continue

        item.price_snapshot = (
            base_price + addon_total
        )

        item.save()

        response_serializer = CartItemSerializer(
            item,
            context={"request": request},
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK,
        )

    def delete(
        self,
        request: Request,
        item_id: int,
    ) -> Response:

        item = self.get_item(
            request,
            item_id,
        )

        if item is None:
            return Response(
                {
                    "detail": "Cart item not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        item.delete()

        return Response(
            {
                "message": (
                    "Cart item removed successfully."
                )
            },
            status=status.HTTP_200_OK,
        )