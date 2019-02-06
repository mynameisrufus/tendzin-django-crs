from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from project.crs.views import ReservationViewSet
from project.crs.views import PropertyViewSet
from project.crs.views import RoomTypeViewSet
from project.crs.views import InventoryAPIView

from rest_framework import routers

router = routers.SimpleRouter(trailing_slash=False)
router.register(r'reservations', ReservationViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'room-types', RoomTypeViewSet)
inventory = path('inventory/<uuid:room_type_id>', InventoryAPIView.as_view())
urlpatterns = router.urls
urlpatterns.append(inventory)
