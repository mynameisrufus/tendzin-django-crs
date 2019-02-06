from django.contrib import admin

from .models import Property, RoomType, Reservation

admin.site.register(Property)
admin.site.register(RoomType)
admin.site.register(Reservation)
