import hashlib
import secrets
import smtplib
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from .models import EmailVerificationToken, User


TOKEN_LIFETIME = timedelta(hours=24)


@transaction.atomic
def send_email_verification(user: User) -> None:
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    now = timezone.now()
    EmailVerificationToken.objects.update_or_create(
        user=user,
        defaults={
            "token_hash": token_hash,
            "expires_at": timezone.now() + TOKEN_LIFETIME,
            "created_at": now,
        },
    )
    verification_url = (
        f"{settings.CUSTOMER_FRONTEND_URL}/verify-email"
        f"?token={token}"
    )
    message = (
        f"Verify your Zaapino email address by opening this link:\n\n"
        f"{verification_url}\n\n"
        "This link expires in 24 hours. If you did not create an account, "
        "you can ignore this email."
    )
    sent = send_mail(
        subject="Verify your Zaapino email address",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
    if sent != 1:
        raise RuntimeError("Email backend did not confirm delivery.")


@transaction.atomic
def verify_email_token(token: str) -> bool:
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    verification = (
        EmailVerificationToken.objects.select_related("user")
        .filter(token_hash=token_hash)
        .first()
    )
    if verification is None or verification.expires_at <= timezone.now():
        if verification is not None:
            verification.delete()
        return False

    user = verification.user
    if user.role != User.Role.CUSTOMER:
        verification.delete()
        return False
    user.is_email_verified = True
    user.save(update_fields=["is_email_verified", "updated_at"])
    verification.delete()
    return True
