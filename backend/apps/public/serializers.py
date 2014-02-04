from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializes a User object"""
    class Meta:
        model = User
        # fields = ('id', 'username')


class LocationSerializer(serializers.ModelSerializer):
    """Serializes a Location object"""
    class Meta:
        model = Location


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username')
    """ Serializes a Comment object """
    class Meta:
        model = Comment

    def get_username(self, obj):
        return obj.user.username


class PhotoSerializer(serializers.ModelSerializer):
    """ Serializes a Photo object """
    class Meta:
        model = Photo
        # fields = ('id', 'username')


class SocialSerializer(serializers.ModelSerializer):
    """Serializes a Social object"""
    class Meta:
        model = Social


class AccountSerializer(serializers.ModelSerializer):
    """Serializes a AccountInfo object"""
    class Meta:
        model = AccountInfo


class PaymentSerializer(serializers.ModelSerializer):
    """Serializes a Payment object"""
    class Meta:
        model = Payment


class VoteSerializer(serializers.ModelSerializer):
    """Serializes a Vote object"""
    class Meta:
        model = Vote