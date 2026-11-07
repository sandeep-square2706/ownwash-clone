from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import Address
from admin_api.models import Offer
from cart.models import Cart, CartItem
from services.models import Category, Service

from .models import Booking


class FirstOrderOfferTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(
            username="first-order-customer",
            email="first-order@example.com",
            password="Secure!Customer-Pass-2026",
        )
        self.address = Address.objects.create(
            user=self.user,
            full_name="First Order Customer",
            phone="9876543210",
            house_number="10",
            street="Main Road",
            area="Central",
            city="Proddatur",
            district="YSR Kadapa",
            state="Andhra Pradesh",
            pincode="516360",
        )
        category = Category.objects.create(
            name="First Order Test",
            slug="first-order-test",
        )
        self.service = Service.objects.create(
            category=category,
            name="Test cleaning",
            slug="first-order-test-cleaning",
            price=Decimal("200.00"),
        )
        self.cart = Cart.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def add_cart_item(self):
        CartItem.objects.create(
            cart=self.cart,
            service=self.service,
            quantity=2,
            price_snapshot=Decimal("200.00"),
        )

    def create_booking(self, coupon_code=""):
        payload = {
            "address": self.address.pk,
            "scheduled_date": (timezone.localdate() + timedelta(days=1)).isoformat(),
            "scheduled_time": "10:00",
        }
        if coupon_code:
            payload["coupon_code"] = coupon_code
        return self.client.post(
            "/api/bookings/",
            payload,
            format="json",
        )

    def test_first_booking_gets_fifty_percent_off_and_next_booking_does_not(self):
        preview = self.client.get("/api/bookings/first-order-offer/")
        self.assertEqual(preview.status_code, 200)
        self.assertEqual(preview.data, {"eligible": True, "discount_percent": 50})

        self.add_cart_item()
        first_booking = self.create_booking()

        self.assertEqual(first_booking.status_code, 201, first_booking.data)
        self.assertEqual(first_booking.data["booking_reference"][:4], "CKB-")
        self.assertEqual(Decimal(first_booking.data["subtotal"]), Decimal("400.00"))
        self.assertEqual(Decimal(first_booking.data["discount"]), Decimal("200.00"))
        self.assertEqual(Decimal(first_booking.data["total_amount"]), Decimal("200.00"))

        preview = self.client.get("/api/bookings/first-order-offer/")
        self.assertEqual(preview.data, {"eligible": False, "discount_percent": 0})

        self.add_cart_item()
        second_booking = self.create_booking()

        self.assertEqual(second_booking.status_code, 201, second_booking.data)
        self.assertEqual(Decimal(second_booking.data["discount"]), Decimal("0.00"))
        self.assertEqual(Decimal(second_booking.data["total_amount"]), Decimal("400.00"))

    def test_cancelled_booking_does_not_use_first_order_offer(self):
        Booking.objects.create(
            user=self.user,
            address=self.address,
            status=Booking.Status.CANCELLED,
            scheduled_date=timezone.localdate() + timedelta(days=1),
            scheduled_time="10:00",
            subtotal=Decimal("400.00"),
            total_amount=Decimal("400.00"),
        )

        preview = self.client.get("/api/bookings/first-order-offer/")

        self.assertEqual(preview.status_code, 200)
        self.assertEqual(preview.data, {"eligible": True, "discount_percent": 50})

    def test_coupon_stacks_with_first_order_discount_and_is_saved(self):
        offer = Offer.objects.create(
            name="Ten percent off",
            code="SAVE10",
            type=Offer.DiscountType.PERCENTAGE,
            value=Decimal("10.00"),
            valid_from=timezone.localdate(),
            valid_to=timezone.localdate() + timedelta(days=1),
        )
        self.add_cart_item()

        preview = self.client.post(
            "/api/bookings/validate-coupon/",
            {"coupon_code": "save10"},
            format="json",
        )
        self.assertEqual(preview.status_code, 200, preview.data)
        self.assertEqual(Decimal(preview.data["first_order_discount"]), Decimal("200.00"))
        self.assertEqual(Decimal(preview.data["coupon_discount"]), Decimal("40.00"))

        booking = self.create_booking("save10")

        self.assertEqual(booking.status_code, 201, booking.data)
        self.assertEqual(Decimal(booking.data["discount"]), Decimal("240.00"))
        self.assertEqual(Decimal(booking.data["total_amount"]), Decimal("160.00"))
        saved = Booking.objects.get(pk=booking.data["id"])
        self.assertEqual(saved.offer, offer)
        self.assertEqual(saved.coupon_code, "SAVE10")

    def test_coupon_cannot_discount_more_than_remaining_subtotal(self):
        Offer.objects.create(
            name="Large coupon",
            code="BIGSAVE",
            type=Offer.DiscountType.FIXED_AMOUNT,
            value=Decimal("500.00"),
            minimum_order=Decimal("100.00"),
        )
        self.add_cart_item()

        booking = self.create_booking("BIGSAVE")

        self.assertEqual(booking.status_code, 201, booking.data)
        self.assertEqual(Decimal(booking.data["discount"]), Decimal("400.00"))
        self.assertEqual(Decimal(booking.data["total_amount"]), Decimal("0.00"))

    def test_invalid_or_expired_coupon_is_rejected_without_creating_booking(self):
        Offer.objects.create(
            name="Expired offer",
            code="EXPIRED",
            type=Offer.DiscountType.PERCENTAGE,
            value=Decimal("20.00"),
            valid_to=timezone.localdate() - timedelta(days=1),
        )
        self.add_cart_item()

        response = self.create_booking("EXPIRED")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Booking.objects.count(), 0)
