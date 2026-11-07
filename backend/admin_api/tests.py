from io import BytesIO
import tempfile
from datetime import timedelta

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from PIL import Image
from rest_framework.test import APIClient

from accounts.models import User
from partners.models import PartnerApproval, PartnerProfile
from services.models import Category, Service

from .models import Offer


class AdminPartnerCreationTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="partner-admin",
            email="partner-admin@example.com",
            password="Admin-Test-Password-1!",
            role=User.Role.ADMIN,
        )
        self.customer = User.objects.create_user(
            username="partner-customer",
            email="partner-customer@example.com",
            password="Customer-Test-Password-1!",
            role=User.Role.CUSTOMER,
        )
        self.client = APIClient()

    def payload(self, **overrides):
        return {
            "legal_name": "New Cleaning Partner",
            "email": "new-partner@example.com",
            "phone": "9876543210",
            "partner_type": PartnerProfile.PartnerType.INDIVIDUAL,
            **overrides,
        }

    def test_admin_can_create_approved_partner_with_one_time_password(self):
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            "/api/admin/partners/",
            self.payload(),
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        partner = PartnerProfile.objects.get(pk=response.data["id"])
        self.assertEqual(partner.status, PartnerProfile.Status.APPROVED)
        self.assertEqual(partner.user.role, User.Role.PARTNER)
        self.assertTrue(partner.user.check_password(response.data["temporary_password"]))
        self.assertNotEqual(partner.user.password, response.data["temporary_password"])
        self.assertEqual(
            partner.approval_history.get().actor,
            self.admin,
        )
        self.assertEqual(
            partner.approval_history.get().action,
            PartnerApproval.Action.APPROVED,
        )

        self.client.force_authenticate(user=None)
        login = self.client.post(
            "/api/auth/login/",
            {
                "email": partner.user.email,
                "password": response.data["temporary_password"],
            },
            format="json",
        )
        self.assertEqual(login.status_code, 200, login.data)
        self.assertEqual(login.data["user"]["role"], User.Role.PARTNER)

    def test_partner_creation_requires_admin_role(self):
        self.client.force_authenticate(self.customer)

        response = self.client.post(
            "/api/admin/partners/",
            self.payload(),
            format="json",
        )

        self.assertEqual(response.status_code, 403)
        self.assertFalse(User.objects.filter(email="new-partner@example.com").exists())

    def test_partner_creation_rejects_duplicate_email_and_phone(self):
        User.objects.create_user(
            username="existing-partner",
            email="existing-partner@example.com",
            password="Existing-Test-Password-1!",
            phone="9999999999",
            role=User.Role.PARTNER,
        )
        self.client.force_authenticate(self.admin)

        duplicate_email = self.client.post(
            "/api/admin/partners/",
            self.payload(email="existing-partner@example.com"),
            format="json",
        )
        duplicate_phone = self.client.post(
            "/api/admin/partners/",
            self.payload(email="other-partner@example.com", phone="9999999999"),
            format="json",
        )

        self.assertEqual(duplicate_email.status_code, 400)
        self.assertEqual(duplicate_phone.status_code, 400)
        self.assertEqual(PartnerProfile.objects.count(), 0)

    def test_admin_can_review_application_and_view_submitted_details(self):
        partner_user = User.objects.create_user(
            username="application-partner",
            email="application-partner@example.com",
            password="Partner-Test-Password-1!",
            phone="9876543210",
            role=User.Role.PARTNER,
        )
        partner = PartnerProfile.objects.create(
            user=partner_user,
            legal_name="Application Partner",
            display_name="Application Partner Display",
            email=partner_user.email,
            phone=partner_user.phone,
            address="10 Example Street",
            city="Test City",
            experience="3 years",
            working_days=["Mon", "Wed"],
            status=PartnerProfile.Status.SUBMITTED,
            application_reference="CKP-TEST1234",
        )
        PartnerApproval.objects.create(
            partner=partner,
            actor=partner_user,
            action=PartnerApproval.Action.SUBMITTED,
        )
        self.client.force_authenticate(self.admin)

        details = self.client.get(f"/api/admin/partners/{partner.pk}/")
        self.assertEqual(details.status_code, 200)
        self.assertEqual(details.data["address"], "10 Example Street")
        self.assertEqual(details.data["working_days"], ["Mon", "Wed"])
        self.assertEqual(len(details.data["approval_history"]), 1)

        approved = self.client.post(
            f"/api/admin/partners/{partner.pk}/action/",
            {"action": "approve"},
            format="json",
        )

        self.assertEqual(approved.status_code, 200, approved.data)
        partner.refresh_from_db()
        self.assertEqual(partner.status, PartnerProfile.Status.APPROVED)
        self.assertEqual(partner.approval_history.count(), 2)
        self.assertEqual(partner.approval_history.latest("created_at").actor, self.admin)

    def test_rejecting_application_requires_reason(self):
        partner_user = User.objects.create_user(
            username="reason-required-partner",
            email="reason-required@example.com",
            password="Partner-Test-Password-1!",
            role=User.Role.PARTNER,
        )
        partner = PartnerProfile.objects.create(
            user=partner_user,
            legal_name="Reason Required Partner",
            phone="1234567890",
            status=PartnerProfile.Status.SUBMITTED,
        )
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            f"/api/admin/partners/{partner.pk}/action/",
            {"action": "reject"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        partner.refresh_from_db()
        self.assertEqual(partner.status, PartnerProfile.Status.SUBMITTED)

    def test_admin_can_block_and_unblock_partner(self):
        partner_user = User.objects.create_user(
            username="blockable-partner",
            email="blockable-partner@example.com",
            password="N3w!Secure-Partner-2026",
            phone="9999999997",
            role=User.Role.PARTNER,
        )
        partner = PartnerProfile.objects.create(
            user=partner_user,
            legal_name="Blockable Partner",
            phone=partner_user.phone,
            status=PartnerProfile.Status.APPROVED,
            application_reference="CKP-BLOCK123",
        )
        self.client.force_authenticate(self.admin)

        missing_reason = self.client.post(
            f"/api/admin/partners/{partner.pk}/action/",
            {"action": "suspend"},
            format="json",
        )
        blocked = self.client.post(
            f"/api/admin/partners/{partner.pk}/action/",
            {"action": "suspend", "reason": "Policy review"},
            format="json",
        )
        self.assertEqual(missing_reason.status_code, 400)
        self.assertEqual(blocked.status_code, 200, blocked.data)
        partner.refresh_from_db()
        self.assertEqual(partner.status, PartnerProfile.Status.SUSPENDED)
        self.assertEqual(partner.approval_history.latest("created_at").actor, self.admin)

        login = self.client.post(
            "/api/auth/login/",
            {
                "email": partner_user.email,
                "password": "N3w!Secure-Partner-2026",
            },
            format="json",
        )
        self.assertEqual(login.status_code, 400)
        self.assertIn("blocked", str(login.data).lower())

        unblocked = self.client.post(
            f"/api/admin/partners/{partner.pk}/action/",
            {"action": "unblock"},
            format="json",
        )
        self.assertEqual(unblocked.status_code, 200, unblocked.data)
        partner.refresh_from_db()
        self.assertEqual(partner.status, PartnerProfile.Status.APPROVED)
        self.assertEqual(partner.approval_history.count(), 2)


class AdminServiceManagementTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="service-admin",
            email="service-admin@example.com",
            password="Admin-Test-Password-1!",
            role=User.Role.ADMIN,
        )
        self.customer = User.objects.create_user(
            username="service-customer",
            email="service-customer@example.com",
            password="Customer-Test-Password-1!",
            role=User.Role.CUSTOMER,
        )
        self.client = APIClient()
        self.media_dir = tempfile.TemporaryDirectory()
        self.media_override = override_settings(MEDIA_ROOT=self.media_dir.name)
        self.media_override.enable()

    def tearDown(self):
        self.media_override.disable()
        self.media_dir.cleanup()

    def png_upload(self, filename="service.png"):
        image = Image.new("RGB", (1, 1), color="white")
        image_bytes = BytesIO()
        image.save(image_bytes, format="PNG")
        return SimpleUploadedFile(
            filename,
            image_bytes.getvalue(),
            content_type="image/png",
        )

    def service_payload(self, **overrides):
        return {
            "name": "Interior Refresh",
            "category": "Vehicle Care",
            "base_price": "499.00",
            "max_price": "699.00",
            "duration": "60",
            "short_description": "Refresh the vehicle interior.",
            "description": "Detailed interior cleaning service.",
            "features": '["Vacuuming", "Wipe down"]',
            "is_active": "true",
            "is_top_service": "true",
            **overrides,
        }

    def test_admin_can_create_image_service_visible_on_customer_api(self):
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            "/api/admin/services/",
            self.service_payload(image=self.png_upload()),
            format="multipart",
        )

        self.assertEqual(response.status_code, 201, response.data)
        service = Service.objects.get(pk=response.data["id"])
        self.assertEqual(service.category.name, "Vehicle Care")
        self.assertEqual(service.price, 499)
        self.assertEqual(service.features, ["Vacuuming", "Wipe down"])
        self.assertTrue(service.images.filter(is_primary=True).exists())
        self.assertIn("/media/services/", response.data["image"])

        public = self.client.get("/api/services/")
        visible = next(item for item in public.data if item["slug"] == service.slug)
        self.assertTrue(visible["isActive"])
        self.assertTrue(visible["isTopService"])
        self.assertTrue(visible["images"])
        self.assertEqual(visible["basePrice"], 499.0)

    def test_admin_can_update_and_remove_service_from_public_catalog(self):
        category = Category.objects.create(name="Vehicle Care", slug="vehicle-care")
        service = Service.objects.create(
            category=category,
            name="Interior Refresh",
            slug="interior-refresh",
            price="499.00",
        )
        self.client.force_authenticate(self.admin)

        updated = self.client.patch(
            f"/api/admin/services/{service.pk}/",
            self.service_payload(base_price="599.00", image=self.png_upload()),
            format="multipart",
        )
        self.assertEqual(updated.status_code, 200, updated.data)
        service.refresh_from_db()
        self.assertEqual(service.price, 599)
        self.assertEqual(service.max_price, 699)
        self.assertTrue(service.images.filter(is_primary=True).exists())

        removed = self.client.delete(f"/api/admin/services/{service.pk}/")
        self.assertEqual(removed.status_code, 200)
        service.refresh_from_db()
        self.assertFalse(service.is_active)
        public = self.client.get("/api/services/")
        self.assertNotIn(service.slug, [item["slug"] for item in public.data])

    def test_service_management_requires_admin_role(self):
        self.client.force_authenticate(self.customer)

        response = self.client.post(
            "/api/admin/services/",
            self.service_payload(),
            format="multipart",
        )

        self.assertEqual(response.status_code, 403)
        self.assertFalse(Service.objects.filter(name="Interior Refresh").exists())


class OfferManagementTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.admin = user_model.objects.create_user(
            username="offers-admin",
            email="offers-admin@example.com",
            password="test-password-123",
            role="ADMIN",
        )
        self.customer = user_model.objects.create_user(
            username="offers-customer",
            email="offers-customer@example.com",
            password="test-password-123",
        )
        self.client = APIClient()

    def offer_payload(self, **overrides):
        payload = {
            "name": "Summer clean",
            "description": "Save on your next cleaning.",
            "code": "summer20",
            "type": Offer.DiscountType.PERCENTAGE,
            "value": "20.00",
            "minimum_order": "100.00",
            "valid_from": timezone.localdate().isoformat(),
            "valid_to": (timezone.localdate() + timedelta(days=7)).isoformat(),
            "is_active": True,
            "show_on_homepage": True,
        }
        return {**payload, **overrides}

    def test_admin_can_create_and_edit_offer(self):
        self.client.force_authenticate(self.admin)
        created = self.client.post(
            "/api/admin/offers/",
            self.offer_payload(),
            format="json",
        )
        self.assertEqual(created.status_code, 201, created.data)
        self.assertEqual(created.data["code"], "SUMMER20")

        updated = self.client.patch(
            f"/api/admin/offers/{created.data['id']}/",
            {"is_active": False},
            format="json",
        )
        self.assertEqual(updated.status_code, 200, updated.data)
        self.assertFalse(updated.data["is_active"])

    def test_offer_management_requires_admin_role(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post(
            "/api/admin/offers/",
            self.offer_payload(),
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_public_offer_list_only_returns_current_homepage_offers(self):
        active = Offer.objects.create(**self.offer_payload())
        Offer.objects.create(**self.offer_payload(
            code="HIDDEN",
            show_on_homepage=False,
        ))
        Offer.objects.create(**self.offer_payload(
            code="EXPIRED",
            valid_to=(timezone.localdate() - timedelta(days=1)).isoformat(),
        ))
        self.client.force_authenticate(self.customer)

        response = self.client.get("/api/offers/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([offer["id"] for offer in response.data], [active.id])

    def test_invalid_percentage_is_rejected(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post(
            "/api/admin/offers/",
            self.offer_payload(value="101"),
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("value", response.data)
