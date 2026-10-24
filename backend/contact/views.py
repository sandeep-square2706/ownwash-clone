from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactMessage


class ContactMessageCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        phone = str(data.get("phone", "")).strip()
        service = str(data.get("service", "")).strip()
        message = str(data.get("message", "")).strip()

        if not name:
            return Response(
                {"detail": "Name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not message:
            return Response(
                {"detail": "Message is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user if request.user.is_authenticated else None

        contact_message = ContactMessage.objects.create(
            user=user,
            name=name,
            email=email,
            phone=phone,
            service=service,
            message=message,
        )

        return Response(
            {
                "message": "Your message has been submitted successfully.",
                "id": contact_message.id,
            },
            status=status.HTTP_201_CREATED,
        )


class AdminContactMessageListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        messages = ContactMessage.objects.select_related("user").all()

        data = []

        for item in messages:
            data.append(
                {
                    "id": item.id,
                    "name": item.name,
                    "email": item.email,
                    "phone": item.phone,
                    "service": item.service,
                    "message": item.message,
                    "status": item.status,
                    "admin_notes": item.admin_notes,
                    "user_id": item.user_id,
                    "created_at": item.created_at,
                    "updated_at": item.updated_at,
                }
            )

        return Response(data)


class AdminContactMessageDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            contact_message = ContactMessage.objects.get(pk=pk)
        except ContactMessage.DoesNotExist:
            return Response(
                {"detail": "Contact message not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if "status" in request.data:
            new_status = request.data["status"]

            valid_statuses = {
                ContactMessage.Status.NEW,
                ContactMessage.Status.IN_PROGRESS,
                ContactMessage.Status.RESOLVED,
            }

            if new_status not in valid_statuses:
                return Response(
                    {"detail": "Invalid status."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            contact_message.status = new_status

        if "admin_notes" in request.data:
            contact_message.admin_notes = str(
                request.data["admin_notes"]
            ).strip()

        contact_message.save()

        return Response(
            {
                "id": contact_message.id,
                "status": contact_message.status,
                "admin_notes": contact_message.admin_notes,
                "updated_at": contact_message.updated_at,
            }
        )