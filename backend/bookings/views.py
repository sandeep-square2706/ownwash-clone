from decimal import Decimal
from typing import Any, cast

from django.conf import settings
from django.db import transaction
from django.db.models import QuerySet

from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Booking, BookingItem
from .serializers import BookingSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self) -> QuerySet[Any]:
        queryset = (
            Booking.objects
            .filter(user=self.request.user)
            .select_related("address")
            .prefetch_related("items")
        )

        return cast(QuerySet[Any], queryset)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        # Get the authenticated customer's backend cart.
        cart = getattr(request.user, "cart", None)

        if cart is None:
            return Response(
                {"detail": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_items = list(
            cart.items
            .select_related("service", "variant")
            .all()
        )

        if not cart_items:
            return Response(
                {"detail": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate the subtotal from server-side cart prices.
        subtotal = Decimal("0.00")

        for cart_item in cart_items:
            subtotal += (
                cart_item.price_snapshot
                * cart_item.quantity
            )

        discount = Decimal("0.00")
        tax = Decimal("0.00")

        # Read the configured convenience fee.
        convenience_fee = Decimal(
            str(
                getattr(
                    settings,
                    "BOOKING_CONVENIENCE_FEE",
                    "0.00",
                )
            )
        ).quantize(Decimal("0.01"))

        # Calculate the authoritative booking total.
        total_amount = (
            subtotal
            - discount
            + tax
            + convenience_fee
        )

        booking = Booking.objects.create(
            user=request.user,
            address=serializer.validated_data["address"],
            scheduled_date=serializer.validated_data[
                "scheduled_date"
            ],
            scheduled_time=serializer.validated_data[
                "scheduled_time"
            ],
            subtotal=subtotal,
            discount=discount,
            tax=tax,
            convenience_fee=convenience_fee,
            total_amount=total_amount,
            notes=serializer.validated_data.get(
                "notes",
                "",
            ),
            status=Booking.Status.PENDING_PAYMENT,
        )

        # Copy the cart items into the booking.
        booking_items = []

        for cart_item in cart_items:
            service = cart_item.service
            variant = cart_item.variant

            unit_price = cart_item.price_snapshot
            total_price = unit_price * cart_item.quantity

            booking_items.append(
                BookingItem(
                    booking=booking,
                    service=service,
                    variant=variant,
                    service_name=service.name,
                    variant_name=(
                        variant.name if variant else ""
                    ),
                    quantity=cart_item.quantity,
                    selected_addons=(
                        cart_item.selected_addons or []
                    ),
                    unit_price=unit_price,
                    total_price=total_price,
                )
            )

        BookingItem.objects.bulk_create(booking_items)

        # Clear the backend cart only after the booking
        # and its items have been created successfully.
        cart.items.all().delete()

        booking = (
            Booking.objects
            .select_related("address")
            .prefetch_related("items")
            .get(pk=booking.pk)
        )

        response_serializer = BookingSerializer(
            booking,
            context={"request": request},
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self) -> QuerySet[Any]:
        queryset = (
            Booking.objects
            .filter(user=self.request.user)
            .select_related("address")
            .prefetch_related("items")
        )

        return cast(QuerySet[Any], queryset)