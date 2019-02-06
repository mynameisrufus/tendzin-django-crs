from django.shortcuts import render
from rest_framework import viewsets
from project.crs.models import Reservation, Property, RoomType
from project.crs.serializers import ReservationSerializer, PropertySerializer, RoomTypeSerializer, InventorySerializer
from project.crs.tendzin import GetInventory, UpdateInventory
from rest_framework import generics
from rest_framework.response import Response


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class RoomTypeViewSet(viewsets.ModelViewSet):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer


class InventoryAPIView(generics.ListCreateAPIView):
    serializer_class = InventorySerializer

    def get_queryset(self):
        return GetInventory.do(self.kwargs['room_type_id'])

    def create(self, request, room_type_id):
        res = UpdateInventory.do(
            room_type_id,
            int(request.data['total']),
            request.data['range_lower'],
            request.data['range_upper']
        )

        if not res.ok:
            return Response(res.data, status=400)

        return Response(None, status=204)
