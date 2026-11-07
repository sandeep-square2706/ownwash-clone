from datetime import date, time
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import Address
from bookings.models import Booking

from .models import Payment


class AdminPaymentApiTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.admin = user_model.objects.create_user(
            username="payment-admin",
            email="payment-admin@example.com",
            password="Secure!PaymentAdmin123",
            role="ADMIN",
        )
        self.customer = user_model.objects.create_user(
            username="payment-customer",
            email="payment-customer@example.com",
            password="Secure!PaymentCustomer123",
        )
        address = Address.objects.create(
            user=self.customer,
            full_name="Payment Customer",
            phone="9876543210",
            house_number="10",
            street="Main Road",
            area="Central",
            city="Proddatur",
            district="YSR Kadapa",
            state="Andhra Pradesh",
            pincode="516360",
        )
        self.booking = Booking.objects.create(
            user=self.customer,
            address=address,
            scheduled_date=date(2026, 11, 10),
            scheduled_time=time(10, 0),
            subtotal=Decimal("500.00"),
            total_amount=Decimal("500.00"),
        )
        self.payment = Payment.objects.create(
            booking=self.booking,
            razorpay_order_id="order_test_admin_dashboard",
            razorpay_payment_id="pay_test_admin_dashboard",
            amount=Decimal("500.00"),
            status=Payment.Status.CAPTURED,
            razorpay_signature="must-not-be-exposed",
        )
        self.client = APIClient()

    def test_admin_can_list_payments_and_summary_without_signature(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get("/api/admin/payments/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["summary"]["captured"], 1)
        self.assertEqual(response.data["summary"]["captured_amount"], "500.00")
        self.assertEqual(response.data["results"][0]["booking_reference"], self.booking.booking_reference)
        self.assertNotIn("razorpay_signature", response.data["results"][0])

    def test_non_admin_cannot_list_or_view_payments(self):
        self.client.force_authenticate(user=self.customer)

        list_response = self.client.get("/api/admin/payments/")
        detail_response = self.client.get(f"/api/admin/payments/{self.payment.pk}/")

        self.assertEqual(list_response.status_code, 403)
        self.assertEqual(detail_response.status_code, 403)

    def test_admin_payment_list_rejects_invalid_pagination(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get("/api/admin/payments/?page=0")

        self.assertEqual(response.status_code, 400)

    def test_customer_can_submit_direct_upi_reference_for_own_booking(self):
        self.payment.status = Payment.Status.FAILED
        self.payment.save(update_fields=["status"])
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            "/api/payments/upi/submit/",
            {
                "booking_id": self.booking.pk,
                "transaction_reference": "123456789012",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        payment = Payment.objects.get(pk=response.data["payment_id"])
        self.assertEqual(payment.method, Payment.Method.DIRECT_UPI)
        self.assertEqual(payment.status, Payment.Status.PENDING_REVIEW)
        self.assertEqual(payment.amount, self.booking.total_amount)
        self.assertEqual(
            payment.upi_transaction_reference,
            "123456789012",
        )
        self.booking.refresh_from_db()
        self.assertEqual(
            self.booking.status,
            Booking.Status.PENDING_PAYMENT,
        )

    def test_customer_cannot_submit_reference_for_another_users_booking(self):
        other_user = get_user_model().objects.create_user(
            username="other-payment-customer",
            email="other-payment-customer@example.com",
            password="test-password",
        )
        other_address = Address.objects.create(
            user=other_user,
            full_name="Other Customer",
            phone="9876543211",
            house_number="11",
            street="Main Road",
            area="Central",
            city="Proddatur",
            district="YSR Kadapa",
            state="Andhra Pradesh",
            pincode="516360",
        )
        other_booking = Booking.objects.create(
            user=other_user,
            address=other_address,
            scheduled_date=date(2026, 11, 11),
            scheduled_time=time(10, 0),
            subtotal=Decimal("500.00"),
            total_amount=Decimal("500.00"),
        )
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            "/api/payments/upi/submit/",
            {
                "booking_id": other_booking.pk,
                "transaction_reference": "123456789012",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 404)

    def test_upi_reference_cannot_be_submitted_for_two_bookings(self):
        self.payment.status = Payment.Status.FAILED
        self.payment.save(update_fields=["status"])
        Payment.objects.create(
            booking=self.booking,
            method=Payment.Method.DIRECT_UPI,
            amount=self.booking.total_amount,
            status=Payment.Status.PENDING_REVIEW,
            upi_transaction_reference="123456789012",
        )
        another_booking = Booking.objects.create(
            user=self.customer,
            address=self.booking.address,
            scheduled_date=date(2026, 11, 12),
            scheduled_time=time(10, 0),
            subtotal=Decimal("500.00"),
            total_amount=Decimal("500.00"),
        )
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            "/api/payments/upi/submit/",
            {
                "booking_id": another_booking.pk,
                "transaction_reference": "123456789012",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 409)

    def test_admin_can_approve_direct_upi_and_confirm_booking(self):
        self.payment.status = Payment.Status.FAILED
        self.payment.save(update_fields=["status"])
        payment = Payment.objects.create(
            booking=self.booking,
            method=Payment.Method.DIRECT_UPI,
            amount=self.booking.total_amount,
            status=Payment.Status.PENDING_REVIEW,
            upi_transaction_reference="123456789012",
        )
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            f"/api/admin/payments/{payment.pk}/upi-review/",
            {"decision": "approve"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        payment.refresh_from_db()
        self.booking.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.CAPTURED)
        self.assertEqual(payment.reviewed_by, self.admin)
        self.assertIsNotNone(payment.reviewed_at)
        self.assertEqual(self.booking.status, Booking.Status.CONFIRMED)

    def test_admin_must_give_reason_when_rejecting_direct_upi(self):
        self.payment.status = Payment.Status.FAILED
        self.payment.save(update_fields=["status"])
        payment = Payment.objects.create(
            booking=self.booking,
            method=Payment.Method.DIRECT_UPI,
            amount=self.booking.total_amount,
            status=Payment.Status.PENDING_REVIEW,
            upi_transaction_reference="123456789012",
        )
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            f"/api/admin/payments/{payment.pk}/upi-review/",
            {"decision": "reject"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.PENDING_REVIEW)

    def test_admin_can_reject_direct_upi_without_confirming_booking(self):
        self.payment.status = Payment.Status.FAILED
        self.payment.save(update_fields=["status"])
        payment = Payment.objects.create(
            booking=self.booking,
            method=Payment.Method.DIRECT_UPI,
            amount=self.booking.total_amount,
            status=Payment.Status.PENDING_REVIEW,
            upi_transaction_reference="123456789012",
        )
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            f"/api/admin/payments/{payment.pk}/upi-review/",
            {"decision": "reject", "note": "No matching bank transaction"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        payment.refresh_from_db()
        self.booking.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.REJECTED)
        self.assertEqual(
            payment.failure_reason,
            "No matching bank transaction",
        )
        self.assertEqual(
            self.booking.status,
            Booking.Status.PENDING_PAYMENT,
        )
