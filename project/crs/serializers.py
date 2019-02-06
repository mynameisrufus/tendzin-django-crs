from rest_framework import serializers
from project.crs.models import Reservation, Property, RoomType


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        depth = 1
        fields = (
            'id',
            'name',
            'description',
            'room_types'
        )


class PropertyShallowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = (
            'id',
            'name',
            'description',
        )


class RoomTypeSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all())

    def to_representation(self, value):
        data = super().to_representation(value)
        property_serializer = PropertyShallowSerializer(value.property)
        data['property'] = property_serializer.data
        return data

    class Meta:
        model = RoomType
        depth = 1
        fields = (
            'id',
            'name',
            'description',
            'property'
        )


class ReservationSerializer(serializers.ModelSerializer):
    room_type = serializers.PrimaryKeyRelatedField(
        queryset=RoomType.objects.all())
    check_out = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    def get_check_out(self, obj):
        return obj.check_out()

    def get_status(self, obj):
        return obj.state_human()

    def to_representation(self, value):
        data = super().to_representation(value)
        room_type_serializer = RoomTypeSerializer(value.room_type)
        data['room_type'] = room_type_serializer.data
        return data

    class Meta:
        model = Reservation
        depth = 2
        fields = (
            'id',
            'check_in',
            'check_out',
            'number_of_nights',
            'number_of_adults',
            'number_of_children',
            'number_of_infants',
            'room_type',
            'special_requests',
            'booking_first_name',
            'booking_last_name',
            'booking_email',
            'booking_phone',
            'status',
        )


class InventorySerializer(serializers.Serializer):
    total = serializers.IntegerField()
    count = serializers.IntegerField(read_only=True)
    range_lower = serializers.DateField()
    range_upper = serializers.DateField()
