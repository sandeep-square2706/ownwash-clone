from typing import Any, cast

from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Address, User
from .serializers import (
    AddressSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(
        self,
        request: Request,
    ) -> Response:

        serializer = RegisterSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user = cast(
            User,
            serializer.save(),
        )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Account created successfully.",
                "user": UserProfileSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(
        self,
        request: Request,
    ) -> Response:

        serializer = LoginSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = cast(
            dict[str, Any],
            serializer.validated_data,
        )

        user = cast(
            User,
            validated_data["user"],
        )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "user": UserProfileSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(
        self,
        request: Request,
    ) -> Response:

        user = cast(
            User,
            request.user,
        )

        serializer = UserProfileSerializer(user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def patch(
        self,
        request: Request,
    ) -> Response:

        user = cast(
            User,
            request.user,
        )

        serializer = UserProfileSerializer(
            user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(
        self,
        request: Request,
    ) -> Response:

        user = cast(
            User,
            request.user,
        )

        addresses = Address.objects.filter(
            user=user,
        )

        serializer = AddressSerializer(
            addresses,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(
        self,
        request: Request,
    ) -> Response:

        user = cast(
            User,
            request.user,
        )

        serializer = AddressSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = cast(
            dict[str, Any],
            serializer.validated_data,
        )

        with transaction.atomic():

            if validated_data.get(
                "is_default",
                False,
            ):
                Address.objects.filter(
                    user=user,
                ).update(
                    is_default=False,
                )

            address = cast(
                Address,
                serializer.save(
                    user=user,
                ),
            )

            # First address automatically becomes default.
            if not Address.objects.filter(
                user=user,
            ).exclude(
                pk=address.pk,
            ).exists():

                address.is_default = True

                address.save(
                    update_fields=[
                        "is_default",
                    ],
                )

        return Response(
            {
                "message": "Address added successfully.",
                "address": AddressSerializer(address).data,
            },
            status=status.HTTP_201_CREATED,
        )


class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_address(
        self,
        request: Request,
        pk: int,
    ) -> Address | None:

        user = cast(
            User,
            request.user,
        )

        try:
            return Address.objects.get(
                pk=pk,
                user=user,
            )
        except Address.DoesNotExist:
            return None

    def patch(
        self,
        request: Request,
        pk: int,
    ) -> Response:

        address = self.get_address(
            request,
            pk,
        )

        if address is None:
            return Response(
                {
                    "detail": "Address not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AddressSerializer(
            address,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = cast(
            dict[str, Any],
            serializer.validated_data,
        )

        with transaction.atomic():

            if validated_data.get(
                "is_default",
                False,
            ):
                Address.objects.filter(
                    user=address.user,
                ).exclude(
                    pk=address.pk,
                ).update(
                    is_default=False,
                )

            address = cast(
                Address,
                serializer.save(),
            )

        return Response(
            {
                "message": "Address updated successfully.",
                "address": AddressSerializer(address).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(
        self,
        request: Request,
        pk: int,
    ) -> Response:

        address = self.get_address(
            request,
            pk,
        )

        if address is None:
            return Response(
                {
                    "detail": "Address not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        was_default = address.is_default
        user = address.user

        with transaction.atomic():

            address.delete()

            # If the deleted address was default,
            # make the newest remaining address default.
            if was_default:

                next_address = (
                    Address.objects
                    .filter(user=user)
                    .order_by("-created_at")
                    .first()
                )

                if next_address:

                    next_address.is_default = True

                    next_address.save(
                        update_fields=[
                            "is_default",
                        ],
                    )

        return Response(
            {
                "message": "Address deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )


class SetDefaultAddressView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(
        self,
        request: Request,
        pk: int,
    ) -> Response:

        user = cast(
            User,
            request.user,
        )

        try:
            address = Address.objects.get(
                pk=pk,
                user=user,
            )
        except Address.DoesNotExist:
            return Response(
                {
                    "detail": "Address not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        with transaction.atomic():

            Address.objects.filter(
                user=user,
            ).update(
                is_default=False,
            )

            address.is_default = True

            address.save(
                update_fields=[
                    "is_default",
                    "updated_at",
                ],
            )

        return Response(
            {
                "message": "Default address updated successfully.",
                "address": AddressSerializer(address).data,
            },
            status=status.HTTP_200_OK,
        )