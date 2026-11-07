from decimal import Decimal
from typing import Any, cast

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import QuerySet

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from admin_api.models import Offer
from .models import Booking, BookingItem
from .serializers import BookingSerializer


FIRST_ORDER_DISCOUNT_PERCENT = 50
User = get_user_model()


def calculate_offer_discount(offer, subtotal):
    if offer.type == Offer.DiscountType.PERCENTAGE:
        amount = subtotal * offer.value / Decimal("100")
    else:
        amount = offer.value
    return min(amount.quantize(Decimal("0.01")), subtotal)


def calculate_first_order_discount(subtotal):
    return (
        subtotal * Decimal(FIRST_ORDER_DISCOUNT_PERCENT) / Decimal("100")
    ).quantize(Decimal("0.01"))


def has_first_order_offer(user):
    return not Booking.objects.filter(user=user).exclude(
        status=Booking.Status.CANCELLED,
    ).exists()


class FirstOrderOfferView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        eligible = has_first_order_offer(request.user)
        return Response({
            "eligible": eligible,
            "discount_percent": FIRST_ORDER_DISCOUNT_PERCENT if eligible else 0,
        })


class CouponValidationView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = str(request.data.get("coupon_code", "")).strip().upper()
        if not code:
            raise ValidationError({"coupon_code": "Enter a coupon code."})

        cart = getattr(request.user, "cart", None)
        cart_items = (
            list(cart.items.all())
            if cart is not None
            else []
        )
        if not cart_items:
            raise ValidationError({"detail": "Your cart is empty."})

        subtotal = sum(
            (item.price_snapshot * item.quantity for item in cart_items),
            Decimal("0.00"),
        )
        offer = Offer.objects.filter(code=code).first()
        if offer is None or not offer.is_current():
            raise ValidationError({
                "coupon_code": "This coupon code is invalid or expired."
            })
        if subtotal < offer.minimum_order:
            raise ValidationError({
                "coupon_code": (
                    f"This coupon requires a minimum order of "
                    f"₹{offer.minimum_order:.2f}."
                )
            })

        first_order_eligible = has_first_order_offer(request.user)
        first_order_discount = (
            calculate_first_order_discount(subtotal)
            if first_order_eligible
            else Decimal("0.00")
        )
        coupon_discount = min(
            calculate_offer_discount(offer, subtotal),
            subtotal - first_order_discount,
        )

        return Response({
            "code": offer.code,
            "name": offer.name,
            "type": offer.type,
            "value": offer.value,
            "subtotal": subtotal,
            "first_order_discount": first_order_discount,
            "coupon_discount": coupon_discount,
            "total_discount": first_order_discount + coupon_discount,
        })


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

        locked_user = User.objects.select_for_update().get(pk=request.user.pk)
        first_order_eligible = has_first_order_offer(locked_user)

        # Calculate the subtotal from server-side cart prices.
        subtotal = Decimal("0.00")

        for cart_item in cart_items:
            subtotal += (
                cart_item.price_snapshot
                * cart_item.quantity
            )

        coupon_code = str(
            request.data.get("coupon_code", "")
        ).strip().upper()
        offer = None
        coupon_discount = Decimal("0.00")
        if coupon_code:
            offer = Offer.objects.select_for_update().filter(
                code=coupon_code,
            ).first()
            if offer is None or not offer.is_current():
                raise ValidationError({
                    "coupon_code": "This coupon code is invalid or expired."
                })
            if subtotal < offer.minimum_order:
                raise ValidationError({
                    "coupon_code": (
                        f"This coupon requires a minimum order of "
                        f"₹{offer.minimum_order:.2f}."
                    )
                })
            coupon_discount = calculate_offer_discount(offer, subtotal)

        first_order_discount = (
            calculate_first_order_discount(subtotal)
            if first_order_eligible
            else Decimal("0.00")
        )
        coupon_discount = min(
            coupon_discount,
            subtotal - first_order_discount,
        )
        discount = first_order_discount + coupon_discount
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
            offer=offer,
            coupon_code=offer.code if offer else "",
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