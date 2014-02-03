from django.db import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.dispatch import receiver
# from settings.base import AUTH_USER_MODEL
#from django import forms
from localflavor.us.forms import USStateSelect
from datetime import datetime
from django.contrib.auth.hashers import make_password, is_password_usable


@receiver(post_save, sender=User)
def hash_password(sender, instance=None, created=False, **kwargs):
   ''' Hashes the password given when a User is created or updated '''
   if not is_password_usable(instance.password):
       instance.password = make_password(instance.password)
       instance.save()

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    ''' Creates a token whenever a User is created '''
    if created:
        Token.objects.create(user=instance)

# class ExtendedUser(AbstractUser):
#    testField = models.CharField(max_length=200)

class Address(models.Model):
    ''' Model features for an address '''
    street = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    gps = models.CharField(max_length=300)

    def __unicode__(self):
        return u'%s, %s, %s' % (self.city, self.state, self.gps)

    class Meta:
        verbose_name_plural = 'Address'

class Location(models.Model):
    ''' Model features for an address '''
    locationName = models.CharField(max_length=200)
    # address = models.USStateSelect()
    gpsLat = models.CharField(max_length=200, blank=True, null=True)
    gpsLng = models.CharField(max_length=200, blank=True, null=True)
    reliableGPS = models.BooleanField()
    street = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    photos = models.ImageField(upload_to='img/locations', blank=True, null=True)
    description = models.CharField(max_length=5000)
    sponsored = models.BooleanField()
    voteCount = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey(User)
    datecreated = models.DateField(default=datetime.now)
    starLocation = models.NullBooleanField(default=False)

    def __unicode__(self):
        return u'%s, %s, %s' % (self.locationName, self.user, self.description)

    class Meta:
        verbose_name_plural = 'Location'

class Comment(models.Model):
    ''' Model features for an address '''
    user = models.ForeignKey(User)
    locationPostID = models.ForeignKey(Location)
    commentText = models.CharField(max_length=900)
    commentDate = models.DateField(default=datetime.now)
    locationRating = models.IntegerField(blank=True, null=True)


    def __unicode__(self):
        return u'%s, %s, %s' % (self.user, self.locationPostID, self.commentText)

    class Meta:
        verbose_name_plural = 'Comment'
