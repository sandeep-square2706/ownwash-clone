import re
from datetime import timedelta
from io import StringIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.management import call_command, CommandError
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import EmailVerificationToken
from partners.models import PartnerProfile


class CreateAdminUserCommandTests(TestCase):
    @patch("accounts.management.commands.create_admin_user.getpass")
    @patch("builtins.input", return_value="first-admin@example.com")
    def test_creates_admin_role_superuser(self, _input, mocked_getpass):
        mocked_getpass.side_effect = ["S3cure!Admin-Pass-2026", "S3cure!Admin-Pass-2026"]

        call_command("create_admin_user", stdout=StringIO())

        admin = get_user_model().objects.get(email="first-admin@example.com")
        self.assertEqual(admin.role, "ADMIN")
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    @patch("accounts.management.commands.create_admin_user.getpass")
    @patch("builtins.input", return_value="customer@example.com")
    def test_does_not_promote_an_existing_account(self, _input, _getpass):
        user_model = get_user_model()
        user_model.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="S3cure!Admin-Pass-2026",
        )

        with self.assertRaises(CommandError):
            call_command("create_admin_user", stdout=StringIO())

        self.assertEqual(
            user_model.objects.get(email="customer@example.com").role,
            "CUSTOMER",
        )


class LoginViewTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="mixed-case-admin",
            email="Admin@Example.com",
            password="S3cure!Admin-Pass-2026",
            role="ADMIN",
        )

    def test_login_accepts_email_with_different_capitalization(self):
        response = self.client.post(
            "/api/auth/login/",
            {
                "email": "admin@example.com",
                "password": "S3cure!Admin-Pass-2026",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["role"], "ADMIN")
        self.assertTrue(response.json()["access"])

    def test_login_rejects_an_incorrect_password(self):
        response = self.client.post(
            "/api/auth/login/",
            {
                "email": "admin@example.com",
                "password": "incorrect",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid email or password.", str(response.json()))

    def test_partner_login_accepts_application_reference_id(self):
        partner_user = get_user_model().objects.create_user(
            username="partner-reference",
            email="partner@example.com",
            password="S3cure!Partner-Pass-2026",
            role="PARTNER",
        )
        PartnerProfile.objects.create(
            user=partner_user,
            legal_name="Partner Reference",
            phone="9999999999",
            application_reference="CKP-A1B2C3D4",
        )

        response = self.client.post(
            "/api/auth/login/",
            {
                "reference_id": "ckp-a1b2c3d4",
                "password": "S3cure!Partner-Pass-2026",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["role"], "PARTNER")
        self.assertTrue(response.json()["access"])

    def test_reference_id_login_rejects_an_incorrect_password(self):
        partner_user = get_user_model().objects.create_user(
            username="partner-reference-invalid",
            email="partner-invalid@example.com",
            password="S3cure!Partner-Pass-2026",
            role="PARTNER",
        )
        PartnerProfile.objects.create(
            user=partner_user,
            legal_name="Partner Reference",
            phone="9999999998",
            application_reference="CKP-D4C3B2A1",
        )

        response = self.client.post(
            "/api/auth/login/",
            {
                "reference_id": "CKP-D4C3B2A1",
                "password": "incorrect",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid email or password.", str(response.json()))


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    CUSTOMER_FRONTEND_URL="https://zaapino.example",
)
class CustomerEmailVerificationTests(TestCase):
    def setUp(self):
        self.payload = {
            "email": "new-customer@example.com",
            "phone": "9876543210",
            "password": "N3w!Secure-Customer-2026",
        }

    def register(self):
        return self.client.post(
            "/api/auth/register/",
            self.payload,
            content_type="application/json",
        )

    def token_from_email(self):
        match = re.search(r"/verify-email\?token=([^\s]+)", mail.outbox[0].body)
        self.assertIsNotNone(match)
        return match.group(1)

    def test_registration_sends_verification_email_without_logging_in(self):
        response = self.register()

        self.assertEqual(response.status_code, 201, response.json())
        self.assertEqual(response.json()["email"], self.payload["email"])
        self.assertNotIn("access", response.json())
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.payload["email"]])
        self.assertIn("https://zaapino.example/verify-email?token=", mail.outbox[0].body)
        user = get_user_model().objects.get(email=self.payload["email"])
        self.assertFalse(user.is_email_verified)

        login = self.client.post(
            "/api/auth/login/",
            {"email": self.payload["email"], "password": self.payload["password"]},
            content_type="application/json",
        )
        self.assertEqual(login.status_code, 400)
        self.assertIn("verify your email", str(login.json()).lower())

    def test_verification_enables_login_and_token_is_single_use(self):
        self.register()
        token = self.token_from_email()

        verification = self.client.post(
            "/api/auth/verify-email/",
            {"token": token},
            content_type="application/json",
        )
        replay = self.client.post(
            "/api/auth/verify-email/",
            {"token": token},
            content_type="application/json",
        )
        login = self.client.post(
            "/api/auth/login/",
            {"email": self.payload["email"], "password": self.payload["password"]},
            content_type="application/json",
        )

        self.assertEqual(verification.status_code, 200, verification.json())
        self.assertEqual(replay.status_code, 400)
        self.assertEqual(login.status_code, 200, login.json())
        self.assertTrue(login.json()["user"]["is_email_verified"])

    def test_customer_cannot_mark_email_verified_through_profile_update(self):
        user_model = get_user_model()
        self.register()
        user = user_model.objects.get(email=self.payload["email"])
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.patch(
            "/api/auth/profile/",
            {"is_email_verified": True},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertFalse(user.is_email_verified)

    def test_expired_verification_link_is_rejected(self):
        self.register()
        token = self.token_from_email()
        record = EmailVerificationToken.objects.get(user__email=self.payload["email"])
        record.expires_at = timezone.now() - timedelta(seconds=1)
        record.save(update_fields=["expires_at"])

        response = self.client.post(
            "/api/auth/verify-email/",
            {"token": token},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(get_user_model().objects.get(email=self.payload["email"]).is_email_verified)

    def test_resend_verification_sends_again_after_cooldown(self):
        self.register()
        record = EmailVerificationToken.objects.get(user__email=self.payload["email"])
        record.created_at = timezone.now() - timedelta(minutes=2)
        record.save(update_fields=["created_at"])

        response = self.client.post(
            "/api/auth/resend-verification/",
            {"email": self.payload["email"]},
            content_type="application/json",
        )
        cooldown_response = self.client.post(
            "/api/auth/resend-verification/",
            {"email": self.payload["email"]},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200, response.json())
        self.assertEqual(cooldown_response.status_code, 200)
        self.assertEqual(len(mail.outbox), 2)

    @patch("accounts.email_verification.send_mail", side_effect=OSError("SMTP unavailable"))
    def test_registration_reports_mail_delivery_failure_and_allows_resend(self, _send_mail):
        response = self.register()

        self.assertEqual(response.status_code, 503)
        self.assertTrue(
            get_user_model().objects.filter(email=self.payload["email"]).exists()
        )
        self.assertFalse(
            EmailVerificationToken.objects.filter(
                user__email=self.payload["email"]
            ).exists()
        )

    def test_existing_admin_and_partner_login_do_not_require_customer_email_verification(self):
        user_model = get_user_model()
        admin = user_model.objects.create_user(
            username="verification-admin",
            email="verification-admin@example.com",
            password="N3w!Secure-Admin-2026",
            role="ADMIN",
        )
        partner = user_model.objects.create_user(
            username="verification-partner",
            email="verification-partner@example.com",
            password="N3w!Secure-Partner-2026",
            role="PARTNER",
        )
        PartnerProfile.objects.create(
            user=partner,
            legal_name="Verification Partner",
            phone="9999999999",
            application_reference="CKP-VERIFY1",
        )

        for account, credential_key, credential in (
            (admin, "email", admin.email),
            (partner, "reference_id", "CKP-VERIFY1"),
        ):
            response = self.client.post(
                "/api/auth/login/",
                {
                    credential_key: credential,
                    "password": (
                        "N3w!Secure-Admin-2026"
                        if account == admin
                        else "N3w!Secure-Partner-2026"
                    ),
                },
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 200, response.json())


class ChangeAdminCredentialsCommandTests(TestCase):
    @patch("accounts.management.commands.change_admin_credentials.getpass")
    @patch("builtins.input")
    def test_updates_admin_email_and_password(self, mocked_input, mocked_getpass):
        user_model = get_user_model()
        user = user_model.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="S3cure!Admin-Pass-2026",
            role="ADMIN",
        )
        mocked_input.side_effect = [
            "admin@example.com",
            "new-admin@example.com",
        ]
        mocked_getpass.side_effect = [
            "N3w!Secure-Admin-Pass-2026",
            "N3w!Secure-Admin-Pass-2026",
        ]

        call_command("change_admin_credentials", stdout=StringIO())

        user.refresh_from_db()
        self.assertEqual(user.email, "new-admin@example.com")
        self.assertTrue(user.check_password("N3w!Secure-Admin-Pass-2026"))
        self.assertEqual(user.role, "ADMIN")

    @patch("accounts.management.commands.change_admin_credentials.getpass")
    @patch("builtins.input")
    def test_does_not_change_credentials_when_passwords_do_not_match(
        self, mocked_input, mocked_getpass
    ):
        user_model = get_user_model()
        user = user_model.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="S3cure!Admin-Pass-2026",
            role="ADMIN",
        )
        mocked_input.side_effect = [
            "admin@example.com",
            "new-admin@example.com",
        ]
        mocked_getpass.side_effect = ["N3w!Secure-Admin-Pass-2026", "does-not-match"]

        with self.assertRaises(CommandError):
            call_command("change_admin_credentials", stdout=StringIO())

        user.refresh_from_db()
        self.assertEqual(user.email, "admin@example.com")
        self.assertTrue(user.check_password("S3cure!Admin-Pass-2026"))

# Create your tests here.
