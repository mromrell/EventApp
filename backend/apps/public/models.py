from django.db import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.dispatch import receiver
# from settings.base import AUTH_USER_MODEL
# from django import forms
from localflavor.us.forms import USStateSelect
from datetime import datetime
from django.contrib.auth.hashers import make_password, is_password_usable


@receiver(post_save, sender=User)
def hash_password(sender, instance=None, created=False, **kwargs):
   # Hashes the password given when a User is created or updated
   if not is_password_usable(instance.password):
       instance.password = make_password(instance.password)
       instance.save()


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    # Creates a token whenever a User is created
    if created:
        Token.objects.create(user=instance)


class Social(models.Model):
    facebook_url = models.URLField(blank=True)
    google_plus = models.URLField(blank=True)
    twitter_handle = models.CharField(max_length=50, blank=True)

    user_id = models.ForeignKey(User)


class AccountInfo(models.Model):
    birth_date = models.DateField(auto_now_add=True)
    phone = models.CharField(max_length=25, blank=True, null=True)
    is_cell = models.NullBooleanField(blank=True, null=True)
    street = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True, null=True)
    state = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=200, blank=True, null=True)
    is_sponsor = models.NullBooleanField(blank=True, null=True)
    is_organizer = models.NullBooleanField(blank=True, null=True)

    social_info = models.ForeignKey(Social, null=True, blank=True)
    user_id = models.ForeignKey(User)


class Location(models.Model):
    # Model features for an address
    eventName = models.CharField(max_length=200, blank=True, null=True)
    gpsLat = models.CharField(max_length=200, blank=True, null=True)
    gpsLng = models.CharField(max_length=200, blank=True, null=True)
    reliableGPS = models.NullBooleanField(blank=True, null=True)
    street = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True, null=True)
    state = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=200, blank=True, null=True)
    description = models.CharField(max_length=5000, blank=True, null=True)
    sponsored = models.NullBooleanField(blank=True, null=True)
    forCharity = models.NullBooleanField(blank=True, null=True)
    linkUrl = models.CharField(max_length=200, blank=True, null=True)
    participantCost = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    totalCost = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    voteCount = models.IntegerField(blank=True, null=True)
    datecreated = models.DateField(default=datetime.now)
    starLocation = models.NullBooleanField(default=False)

    user = models.ForeignKey(User)

    def __unicode__(self):
        return u'%s, %s, %s' % (self.eventName, self.user, self.description)

    class Meta:
        verbose_name_plural = 'Location'


class Payment(models.Model):
    PAYMENT_TYPE_LIST = (
        ('Sponsor', 'Sponsor'),
        ('Registration', 'Registration'),
    )
    payment_amount = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    sponsor_amount = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_LIST)
    user_id = models.ForeignKey(User)
    event_id = models.ForeignKey(Location)


class Vote(models.Model):
    is_up = models.NullBooleanField(blank=True, null=True)
    is_down = models.NullBooleanField(blank=True, null=True)

    user_id = models.ForeignKey(User)
    event_id = models.ForeignKey(Location)


class Comment(models.Model):
    # Model features for an address
    user = models.ForeignKey(User)
    commentText = models.CharField(max_length=900, blank=True, null=True)
    commentDate = models.DateField(default=datetime.now)
    locationRating = models.IntegerField(blank=True, null=True)

    locationPostID = models.ForeignKey(Location)

    def __unicode__(self):
        return u'%s, %s, %s' % (self.user, self.locationPostID, self.commentText)

    class Meta:
        verbose_name_plural = 'Comment'


class Photo(models.Model):
    # Model features for an address
    photo = models.ImageField(upload_to='img/locations', blank=True, null=True)
    is_profile = models.NullBooleanField(blank=True, null=True)

    user = models.ForeignKey(User)
    eventPostID = models.ForeignKey(Location, blank=True, null=True)

    def __unicode__(self):
        return u'%s, %s' % (self.user, self.eventPostID)

    class Meta:
        verbose_name_plural = 'Photos'