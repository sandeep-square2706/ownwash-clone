from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Category, Service
from .serializers import CategorySerializer, ServiceSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]



class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

    lookup_field = "slug"

    queryset = (
        Service.objects
        .filter(is_active=True)
        .select_related("category")
        .prefetch_related("images", "variants")
    )

    def get_queryset(self):
        queryset = super().get_queryset()

        top_service = self.request.query_params.get("top_service")

        if top_service == "true":
            queryset = queryset.filter(is_top_service=True)

        return queryset