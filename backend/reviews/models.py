from django.conf import settings
from django.db import models


class Review(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviews",
    )

    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)

    service = models.CharField(max_length=150, blank=True)

    review_title = models.CharField(max_length=200, blank=True)

    rating = models.PositiveSmallIntegerField()

    review_text = models.TextField()

    photo = models.ImageField(
        upload_to="reviews/",
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    admin_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.rating}/5"