from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Review


class ReviewCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        service = str(data.get("service", "")).strip()
        review_text = str(
            data.get("review_text", data.get("review", ""))
        ).strip()

        try:
            rating = int(data.get("rating", 0))
        except (TypeError, ValueError):
            rating = 0

        if not name:
            return Response(
                {"detail": "Name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not review_text:
            return Response(
                {"detail": "Review is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if rating < 1 or rating > 5:
            return Response(
                {"detail": "Rating must be between 1 and 5."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user if request.user.is_authenticated else None

        review = Review.objects.create(
            user=user,
            name=name,
            email=email,
            service=service,
            rating=rating,
            review_text=review_text,
        )

        return Response(
            {
                "message": "Your review has been submitted successfully.",
                "id": review.id,
                "status": review.status,
            },
            status=status.HTTP_201_CREATED,
        )
class ApprovedReviewListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        reviews = Review.objects.filter(
            status=Review.Status.APPROVED
        )

        data = []

        for review in reviews:
            data.append(
                {
                    "id": review.id,
                    "name": review.name,
                    "service": review.service,
                    "rating": review.rating,
                    "text": review.review_text,
                    "avatar": "👤",
                    "created_at": review.created_at,
                }
            )

        return Response(data)

class AdminReviewListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        reviews = Review.objects.select_related("user").all()

        data = []

        for review in reviews:
            data.append(
                {
                    "id": review.id,
                    "name": review.name,
                    "email": review.email,
                    "service": review.service,
                    "rating": review.rating,
                    "review_text": review.review_text,
                    "status": review.status,
                    "admin_notes": review.admin_notes,
                    "user_id": review.user_id,
                    "created_at": review.created_at,
                    "updated_at": review.updated_at,
                }
            )

        return Response(data)


class AdminReviewDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response(
                {"detail": "Review not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if "status" in request.data:
            new_status = request.data["status"]

            valid_statuses = {
                Review.Status.PENDING,
                Review.Status.APPROVED,
                Review.Status.REJECTED,
            }

            if new_status not in valid_statuses:
                return Response(
                    {"detail": "Invalid review status."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            review.status = new_status

        if "admin_notes" in request.data:
            review.admin_notes = str(
                request.data["admin_notes"]
            ).strip()

        review.save()

        return Response(
            {
                "id": review.id,
                "status": review.status,
                "admin_notes": review.admin_notes,
                "updated_at": review.updated_at,
            }
        )