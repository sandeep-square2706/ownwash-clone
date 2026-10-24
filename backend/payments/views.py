import logging
from decimal import Decimal, ROUND_HALF_UP
from typing import Any

import razorpay

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking

from .models import Payment


logger = logging.getLogger(__name__)


def get_razorpay_client() -> tuple[Any | None, str]:
    """
    Return a configured Razorpay client and the public Key ID.
    Never expose the Key Secret in an API response.
    """
    key_id: str = (
        getattr(settings, "RAZORPAY_KEY_ID", "") or ""
    ).strip()

    key_secret: str = (
        getattr(settings, "RAZORPAY_KEY_SECRET", "") or ""
    ).strip()

    if not key_id or not key_secret:
        return None, key_id

    client = razorpay.Client(
        auth=(key_id, key_secret)
    )

    return client, key_id


def amount_in_paise(amount: Decimal | str | int) -> int:
    """
    Convert a rupee amount into integer paise.
    Example: Decimal("125.50") becomes 12550.
    """
    rounded_amount = Decimal(str(amount)).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    return int(rounded_amount * 100)


def order_response(
    payment: Payment,
    key_id: str,
    status_code: int = status.HTTP_200_OK,
) -> Response:
    """
    Return the information the frontend needs to open
    Razorpay Checkout.
    """
    return Response(
        {
            "key_id": key_id,
            "order_id": payment.razorpay_order_id,
            "amount": amount_in_paise(payment.amount),
            "currency": payment.currency,
            "booking_id": payment.booking.pk,
            "booking_reference": (
                payment.booking.booking_reference
            ),
        },
        status=status_code,
    )


class CreateRazorpayOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        raw_booking_id = request.data.get("booking_id")

        try:
            if isinstance(raw_booking_id, bool):
                raise ValueError

            booking_id = int(raw_booking_id)
        except (TypeError, ValueError):
            return Response(
                {"detail": "A valid booking_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Customers may only pay for their own bookings.
        booking = Booking.objects.filter(
            pk=booking_id,
            user=request.user,
        ).first()

        if booking is None:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if booking.status != Booking.Status.PENDING_PAYMENT:
            return Response(
                {
                    "detail": (
                        "This booking is not awaiting payment."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        if booking.total_amount <= Decimal("0.00"):
            return Response(
                {
                    "detail": (
                        "The booking amount must be positive."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Never create a new order for an already-paid booking.
        captured_payment = Payment.objects.filter(
            booking=booking,
            status=Payment.Status.CAPTURED,
        ).first()

        if captured_payment:
            return Response(
                {"detail": "This booking has already been paid."},
                status=status.HTTP_409_CONFLICT,
            )

        # Avoid creating another order while an existing
        # payment is authorized but not yet captured.
        authorized_payment = Payment.objects.filter(
            booking=booking,
            status=Payment.Status.AUTHORIZED,
        ).first()

        if authorized_payment:
            return Response(
                {
                    "detail": (
                        "A payment is authorized but not captured. "
                        "Check its status before retrying."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        client, key_id = get_razorpay_client()

        if client is None:
            return Response(
                {
                    "detail": (
                        "Payment gateway is not configured. "
                        "Check the backend environment variables."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Reuse an existing order if the customer submits
        # the same pending booking again.
        existing_payment = (
            Payment.objects
            .filter(
                booking=booking,
                status=Payment.Status.CREATED,
            )
            .order_by("-created_at")
            .first()
        )

        if existing_payment:
            if (
                amount_in_paise(existing_payment.amount)
                != amount_in_paise(booking.total_amount)
            ):
                return Response(
                    {
                        "detail": (
                            "The booking amount changed. "
                            "Please contact support before retrying."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            return order_response(existing_payment, key_id)

        payable_amount = amount_in_paise(
            booking.total_amount
        )

        try:
            razorpay_order = client.order.create(
                data={
                    "amount": payable_amount,
                    "currency": "INR",
                    "receipt": (
                        f"CK-{booking.booking_reference}"
                    )[:40],
                    "notes": {
                        "booking_reference": (
                            booking.booking_reference
                        ),
                        "booking_id": str(booking.pk),
                    },
                }
            )
        except Exception:
            logger.exception(
                "Razorpay order creation failed."
            )

            return Response(
                {
                    "detail": (
                        "Could not create a payment order. "
                        "Please try again."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        razorpay_order_id = razorpay_order.get("id")

        try:
            gateway_amount = int(
                razorpay_order.get("amount", -1)
            )
        except (TypeError, ValueError):
            gateway_amount = -1

        if (
            not isinstance(razorpay_order_id, str)
            or not razorpay_order_id
            or gateway_amount != payable_amount
            or razorpay_order.get("currency") != "INR"
        ):
            return Response(
                {
                    "detail": (
                        "The payment gateway returned an invalid order."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        payment = Payment.objects.create(
            booking=booking,
            razorpay_order_id=razorpay_order_id,
            amount=booking.total_amount,
            currency="INR",
            status=Payment.Status.CREATED,
        )

        return order_response(
            payment,
            key_id,
            status_code=status.HTTP_201_CREATED,
        )


class VerifyRazorpayPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get(
            "razorpay_order_id"
        )
        razorpay_payment_id = request.data.get(
            "razorpay_payment_id"
        )
        razorpay_signature = request.data.get(
            "razorpay_signature"
        )

        values = (
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        )

        if not all(
            isinstance(value, str) and value.strip()
            for value in values
        ):
            return Response(
                {
                    "detail": (
                        "razorpay_order_id, "
                        "razorpay_payment_id and "
                        "razorpay_signature are required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Match the order to the authenticated customer.
        payment = (
            Payment.objects
            .select_related("booking")
            .filter(
                razorpay_order_id=razorpay_order_id,
                booking__user=request.user,
            )
            .first()
        )

        if payment is None:
            return Response(
                {"detail": "Payment order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        client, _ = get_razorpay_client()

        if client is None:
            return Response(
                {"detail": "Payment gateway is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Step 1: Verify the signature returned by Checkout.
        try:
            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                }
            )
        except Exception:
            return Response(
                {
                    "detail": (
                        "Payment signature verification failed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Step 2: Fetch the payment directly from Razorpay.
        try:
            razorpay_payment = client.payment.fetch(
                razorpay_payment_id
            )
        except Exception:
            logger.exception(
                "Could not fetch Razorpay payment status."
            )

            return Response(
                {
                    "detail": (
                        "Could not confirm payment status. "
                        "Please try again."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # Check that the fetched payment is linked to this order.
        if (
            razorpay_payment.get("order_id")
            != razorpay_order_id
        ):
            return Response(
                {"detail": "Payment does not match the order."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            provider_amount = int(
                razorpay_payment.get("amount", -1)
            )
        except (TypeError, ValueError):
            provider_amount = -1

        if (
            provider_amount != amount_in_paise(payment.amount)
            or razorpay_payment.get("currency") != payment.currency
        ):
            return Response(
                {
                    "detail": (
                        "The payment amount or currency "
                        "does not match the order."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        provider_status = razorpay_payment.get("status")

        # Record failed payments, but never confirm their bookings.
        if provider_status == "failed":
            with transaction.atomic():
                locked_payment = (
                    Payment.objects
                    .select_for_update()
                    .get(pk=payment.pk)
                )

                if (
                    locked_payment.status
                    != Payment.Status.CAPTURED
                ):
                    locked_payment.status = Payment.Status.FAILED
                    locked_payment.razorpay_payment_id = (
                        razorpay_payment_id
                    )
                    locked_payment.razorpay_signature = (
                        razorpay_signature
                    )
                    locked_payment.failure_reason = (
                        razorpay_payment.get("error_description")
                        or "Razorpay reported a failed payment."
                    )
                    locked_payment.verified_at = timezone.now()

                    locked_payment.save(
                        update_fields=[
                            "status",
                            "razorpay_payment_id",
                            "razorpay_signature",
                            "failure_reason",
                            "verified_at",
                            "updated_at",
                        ]
                    )

            return Response(
                {
                    "detail": "Razorpay reports that payment failed.",
                    "payment_status": "FAILED",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Authorization alone is not proof of a captured payment.
        if provider_status == "authorized":
            with transaction.atomic():
                locked_payment = (
                    Payment.objects
                    .select_for_update()
                    .get(pk=payment.pk)
                )

                if (
                    locked_payment.status
                    != Payment.Status.CAPTURED
                ):
                    locked_payment.status = (
                        Payment.Status.AUTHORIZED
                    )
                    locked_payment.razorpay_payment_id = (
                        razorpay_payment_id
                    )
                    locked_payment.razorpay_signature = (
                        razorpay_signature
                    )
                    locked_payment.verified_at = timezone.now()

                    locked_payment.save(
                        update_fields=[
                            "status",
                            "razorpay_payment_id",
                            "razorpay_signature",
                            "verified_at",
                            "updated_at",
                        ]
                    )

            return Response(
                {
                    "detail": (
                        "Payment is authorized but not captured. "
                        "The booking has not been confirmed."
                    ),
                    "payment_status": "AUTHORIZED",
                },
                status=status.HTTP_202_ACCEPTED,
            )

        # Only captured payments can confirm a booking.
        if provider_status != "captured":
            return Response(
                {
                    "detail": (
                        "Razorpay has not confirmed a captured payment."
                    ),
                    "payment_status": provider_status,
                },
                status=status.HTTP_409_CONFLICT,
            )

        needs_manual_review = False

        # Save payment and booking state atomically.
        with transaction.atomic():
            locked_payment = (
                Payment.objects
                .select_for_update()
                .get(pk=payment.pk)
            )

            booking = (
                Booking.objects
                .select_for_update()
                .get(pk=locked_payment.booking.pk)
            )

            if (
                locked_payment.status == Payment.Status.CAPTURED
                and locked_payment.razorpay_payment_id
                != razorpay_payment_id
            ):
                return Response(
                    {
                        "detail": (
                            "This order already has a different "
                            "captured payment. Contact support."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            # Flag unexpected duplicate captures for manual review.
            another_captured_payment = (
                Payment.objects
                .filter(
                    booking=booking,
                    status=Payment.Status.CAPTURED,
                )
                .exclude(pk=locked_payment.pk)
                .exists()
            )

            if locked_payment.status != Payment.Status.CAPTURED:
                locked_payment.status = Payment.Status.CAPTURED
                locked_payment.razorpay_payment_id = (
                    razorpay_payment_id
                )
                locked_payment.razorpay_signature = (
                    razorpay_signature
                )
                locked_payment.failure_reason = ""
                locked_payment.verified_at = timezone.now()

                locked_payment.save(
                    update_fields=[
                        "status",
                        "razorpay_payment_id",
                        "razorpay_signature",
                        "failure_reason",
                        "verified_at",
                        "updated_at",
                    ]
                )

            if booking.status == Booking.Status.PENDING_PAYMENT:
                booking.status = Booking.Status.CONFIRMED
                booking.save(
                    update_fields=[
                        "status",
                        "updated_at",
                    ]
                )
            elif booking.status != Booking.Status.CONFIRMED:
                needs_manual_review = True

            if another_captured_payment:
                needs_manual_review = True

        if needs_manual_review:
            return Response(
                {
                    "detail": (
                        "Payment was captured, but this booking "
                        "requires manual review."
                    ),
                    "payment_status": "CAPTURED",
                    "booking_id": booking.pk,
                    "booking_reference": booking.booking_reference,
                    "booking_status": booking.status,
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            {
                "success": True,
                "message": "Payment verified successfully.",
                "payment_status": "CAPTURED",
                "booking_id": booking.pk,
                "booking_reference": booking.booking_reference,
                "booking_status": booking.status,
            },
            status=status.HTTP_200_OK,
        )