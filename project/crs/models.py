import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from datetime import date
from project.crs.tendzin import MakeReservation, CancelReservation
from datetime import timedelta


def check_in_valid(value):
    if value < date.today():
        raise ValidationError(
            _('check in %(value)s needs to be today or in the future'),
            params={'value': value},
        )


def number_of_nights_valid(value):
    if value < 1:
        raise ValidationError(
            _('must stay at least one night'),
        )


def number_of_adults_valid(value):
    if value < 1:
        raise ValidationError(
            _('reservation requires at least one adult'),
        )


class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name


class RoomType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    property = models.ForeignKey(
        Property,
        related_name='room_types',
        on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Reservation(models.Model):
    PENDING = 'PE'
    CONFIRMED = 'CO'
    CANCELLED = 'CA'

    RESERVATION_STATES = (
        (PENDING, 'pending'),
        (CONFIRMED, 'confirmed'),
        (CANCELLED, 'cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_first_name = models.CharField(max_length=200)
    booking_last_name = models.CharField(max_length=200)
    booking_email = models.CharField(max_length=200)
    booking_phone = models.CharField(max_length=200)
    special_requests = models.TextField(null=True, blank=True)
    number_of_adults = models.IntegerField(validators=[number_of_adults_valid])
    number_of_children = models.IntegerField()
    number_of_infants = models.IntegerField()
    number_of_nights = models.IntegerField(validators=[number_of_nights_valid])
    check_in = models.DateField(validators=[check_in_valid])
    room_type = models.ForeignKey(
        RoomType,
        related_name='reservations',
        on_delete=models.PROTECT)
    state = models.CharField(
        editable=False,
        max_length=2,
        choices=RESERVATION_STATES,
        default=PENDING,
    )

    def state_human(self):
        return [item for item in self.RESERVATION_STATES if item[0] ==
                self.state][0][1]

    def check_out(self):
        return self.check_in + timedelta(days=self.number_of_nights)

    def last_night(self):
        return self.check_in + timedelta(days=self.number_of_nights - 1)

    def save(self, *args, **kwargs):
        if self.state != self.PENDING:
            return self

        res = MakeReservation.do(
            self.id, self.room_type_id, self.check_in,
            self.last_night())

        if not res.ok:
            raise ValidationError(
                _('Tendzin error %(value)s'),
                params={'value': res.data},
            )

        self.state = 'CO'

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.state == self.CANCELLED:
            return self

        res = CancelReservation.do(self.id, self.room_type_id, self.check_in,
                                   self.last_night())

        if not res.ok:
            raise ValidationError(
                _('Tendzin error %(value)s'),
                params={'value': res.data},
            )

        self.state = 'CA'

        super().save(*args, **kwargs)
