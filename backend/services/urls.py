from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ServiceViewSet


router = DefaultRouter()

router.register("services", ServiceViewSet, basename="service")
router.register("categories", CategoryViewSet, basename="category")

urlpatterns = router.urls