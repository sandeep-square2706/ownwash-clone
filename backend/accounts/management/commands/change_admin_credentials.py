from getpass import getpass

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import validate_email
from django.db import transaction


class Command(BaseCommand):
    help = "Change the email and password for an existing CleanKart admin."

    @transaction.atomic
    def handle(self, *args, **options):
        user_model = get_user_model()
        current_email = input("Current admin email: ").strip()
        user = user_model.objects.filter(
            email__iexact=current_email,
            role="ADMIN",
        ).first()
        if user is None:
            raise CommandError("No admin account was found with that email.")

        new_email = input("New admin email: ").strip().lower()
        try:
            validate_email(new_email)
        except ValidationError as error:
            raise CommandError("Enter a valid email address.") from error

        if user_model.objects.filter(email__iexact=new_email).exclude(pk=user.pk).exists():
            raise CommandError("Another account already uses that email.")

        password = getpass("New password: ")
        confirmation = getpass("Confirm new password: ")
        if password != confirmation:
            raise CommandError("The passwords do not match.")

        user.email = new_email
        try:
            validate_password(password, user=user)
        except ValidationError as error:
            raise CommandError(" ".join(error.messages)) from error

        user.set_password(password)
        user.save(update_fields=["email", "password"])
        self.stdout.write(self.style.SUCCESS("Admin login credentials updated."))
