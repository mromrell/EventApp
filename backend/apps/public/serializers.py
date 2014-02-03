from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializes a User object"""
    class Meta:
        model = User
        # fields = ('id', 'username')


class AddressSerializer(serializers.ModelSerializer):
    """Serializes an Address object"""
    class Meta:
        model = Address


class LocationSerializer(serializers.ModelSerializer):
    """Serializes a User object"""
    class Meta:
        model = Location

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username')

    """Serializes a User object"""
    class Meta:
        model = Comment

    def get_username(self, obj):
        return obj.user.username