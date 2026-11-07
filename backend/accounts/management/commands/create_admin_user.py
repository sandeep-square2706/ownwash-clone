from getpass import getpass

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import validate_email
from django.db import transaction


class Command(BaseCommand):
    help = "Create a Django superuser with the CleanKart ADMIN role."

    @transaction.atomic
    def handle(self, *args, **options):
        user_model = get_user_model()
        email = input("Admin email: ").strip().lower()
        try:
            validate_email(email)
        except ValidationError as error:
            raise CommandError("Enter a valid email address.") from error

        if user_model.objects.filter(email__iexact=email).exists():
            raise CommandError(
                "An account already uses this email. "
                "Use a different email; this command does not promote existing accounts."
            )

        password = getpass("Password: ")
        confirmation = getpass("Confirm password: ")
        if password != confirmation:
            raise CommandError("The passwords do not match.")

        username = email.split("@", 1)[0]
        base_username = username
        suffix = 1
        while user_model.objects.filter(username=username).exists():
            username = f"{base_username}{suffix}"
            suffix += 1

        user = user_model(username=username, email=email)
        try:
            validate_password(password, user=user)
        except ValidationError as error:
            raise CommandError(" ".join(error.messages)) from error

        user_model.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            role="ADMIN",
        )
        self.stdout.write(self.style.SUCCESS(f"Admin account created for {email}."))
