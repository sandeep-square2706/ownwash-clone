from datetime import timedelta
from decimal import Decimal
from types import SimpleNamespace

from django.utils import timezone
from django.test import TestCase
from django.core.cache import cache
from rest_framework.test import APIClient

from accounts.models import User
from .models import PartnerInvoice, PartnerProfile
from .permissions import IsPartner


class PartnerBillingAccessTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="partner-test",
            email="partner-test@example.com",
            password="test-password",
            role=User.Role.PARTNER,
        )
        self.partner = PartnerProfile.objects.create(
            user=self.user,
            legal_name="Partner Test",
            phone="9999999999",
        )
        self.permission = IsPartner()

    def add_invoice(self, due_date):
        return PartnerInvoice.objects.create(
            partner=self.partner,
            reference=f"TEST-{due_date.isoformat()}",
            description="Partner platform fee",
            amount=Decimal("100.00"),
            due_date=due_date,
        )

    def request(self, path):
        return SimpleNamespace(user=self.user, path=path)

    def test_overdue_invoice_blocks_partner_operations_but_allows_billing(self):
        self.add_invoice(timezone.localdate() - timedelta(days=1))

        self.assertFalse(self.permission.has_permission(
            self.request("/api/partners/bookings/"),
            None,
        ))
        self.assertTrue(self.permission.has_permission(
            self.request("/api/partners/billing/"),
            None,
        ))
        self.assertTrue(self.permission.has_permission(
            self.request("/api/partners/me/"),
            None,
        ))

    def test_invoice_due_today_does_not_block_partner(self):
        self.add_invoice(timezone.localdate())

        self.assertTrue(self.permission.has_permission(
            self.request("/api/partners/bookings/"),
            None,
        ))

    def test_paid_invoice_restores_partner_operations(self):
        invoice = self.add_invoice(timezone.localdate() - timedelta(days=1))
        invoice.status = PartnerInvoice.Status.PAID
        invoice.save(update_fields=["status"])

        self.assertTrue(self.permission.has_permission(
            self.request("/api/partners/bookings/"),
            None,
        ))

    def test_suspended_partner_cannot_use_existing_access_token(self):
        self.partner.status = PartnerProfile.Status.SUSPENDED
        self.partner.save(update_fields=["status"])

        self.assertFalse(self.permission.has_permission(
            self.request("/api/partners/bookings/"),
            None,
        ))

    def test_admin_can_issue_invoice_and_record_payment(self):
        admin = User.objects.create_user(
            username="admin-test",
            email="admin-test@example.com",
            password="test-password",
            role=User.Role.ADMIN,
        )
        client = APIClient()
        client.force_authenticate(user=admin)
        response = client.post(
            f"/api/admin/partners/{self.partner.pk}/invoices/",
            {
                "description": "Partner platform fee",
                "amount": "125.00",
                "due_date": (timezone.localdate() - timedelta(days=1)).isoformat(),
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(self.partner.billing_blocked)

        payment_response = client.post(
            f"/api/admin/partner-invoices/{response.data['id']}/mark-paid/",
            {"payment_reference": "verified-receipt-1"},
            format="json",
        )
        self.assertEqual(payment_response.status_code, 200)
        self.partner.refresh_from_db()
        self.assertFalse(self.partner.billing_blocked)


class PartnerRegistrationTests(TestCase):
    def test_registration_returns_success_with_billing_status(self):
        client = APIClient()
        response = client.post(
            "/api/partners/register/",
            {
                "type": "INDIVIDUAL",
                "name": "Registration Test",
                "phone": "9876543210",
                "email": "registration-test@example.com",
                "password": "N3w!Secure-Partner-Pass-2026",
                "house": "10 Main Street",
                "area": "Central",
                "city": "Proddatur",
                "district": "YSR Kadapa",
                "state": "Andhra Pradesh",
                "pincode": "516360",
                "experience": "1-3 years",
                "team_size": 1,
                "distance": 10,
                "days": ["Mon", "Tue"],
                "start": "06:00",
                "end": "18:00",
                "services": ["foam-washing"],
                "agreement": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(response.data["access"])
        self.assertFalse(response.data["partner"]["billing_blocked"])
        self.assertEqual(self.partner_login_count(), 0)

    def test_registration_saves_birth_date_and_gender(self):
        response = APIClient().post(
            "/api/partners/register/",
            {
                "name": "Partner Profile Details",
                "phone": "9876543211",
                "email": "partner-details@example.com",
                "password": "N3w!Secure-Partner-Pass-2026",
                "date_of_birth": "1995-06-15",
                "gender": "FEMALE",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.content)
        partner = PartnerProfile.objects.get(
            user__email="partner-details@example.com"
        )
        self.assertEqual(partner.date_of_birth.isoformat(), "1995-06-15")
        self.assertEqual(partner.gender, PartnerProfile.Gender.FEMALE)

    def test_registration_rejects_invalid_birth_date(self):
        response = APIClient().post(
            "/api/partners/register/",
            {
                "name": "Partner Invalid Date",
                "phone": "9876543212",
                "email": "partner-invalid-date@example.com",
                "password": "N3w!Secure-Partner-Pass-2026",
                "date_of_birth": "not-a-date",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "Enter a valid date of birth.")

    def partner_login_count(self):
        return PartnerProfile.objects.get(
            user__email="registration-test@example.com"
        ).login_count


class PartnerLoginTrackingTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="login-tracking-partner",
            email="login-tracking@example.com",
            password="N3w!Secure-Partner-Pass-2026",
            phone="9876543210",
            role=User.Role.PARTNER,
        )
        self.partner = PartnerProfile.objects.create(
            user=self.user,
            legal_name="Login Tracking Partner",
            phone=self.user.phone,
        )
        self.client = APIClient()

    def test_password_logins_count_every_successful_login(self):
        for _ in range(2):
            response = self.client.post(
                "/api/auth/login/",
                {
                    "email": self.user.email,
                    "password": "N3w!Secure-Partner-Pass-2026",
                },
                format="json",
            )
            self.assertEqual(response.status_code, 200)

        self.partner.refresh_from_db()
        self.assertEqual(self.partner.login_count, 2)

    def test_failed_password_login_is_not_counted(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": self.user.email, "password": "wrong-password"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.partner.refresh_from_db()
        self.assertEqual(self.partner.login_count, 0)

    def test_otp_login_is_counted(self):
        cache.set(f"partner_otp:{self.user.phone}", "123456", 300)
        response = self.client.post(
            "/api/partners/login/otp/verify/",
            {"phone": self.user.phone, "otp": "123456"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.partner.refresh_from_db()
        self.assertEqual(self.partner.login_count, 1)

    def test_admin_dashboard_reports_total_partner_login_events(self):
        self.partner.login_count = 2
        self.partner.save(update_fields=["login_count"])
        admin = User.objects.create_user(
            username="login-count-admin",
            email="login-count-admin@example.com",
            password="N3w!Secure-Admin-Pass-2026",
            role=User.Role.ADMIN,
        )
        self.client.force_authenticate(user=admin)

        response = self.client.get("/api/admin/dashboard/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["partner_logins"], 2)
