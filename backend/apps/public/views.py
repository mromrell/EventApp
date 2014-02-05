from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.contrib import auth
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view
from django.core.context_processors import csrf
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework import status

from rest_framework.authtoken.views import ObtainAuthToken

from rest_framework import generics
from rest_framework import permissions

from django.contrib.auth.models import User
from .models import *
from .serializers import *


# Create your views here.
class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class UserList(generics.ListCreateAPIView):
    """List all users or create a new User"""
   # permission_classes = (permissions.IsAuthenticated,)
    model = User
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    """Retrieve, update or delete a User instance."""
    permission_classes = (permissions.IsAuthenticated,)
    model = User
    serializer_class = UserSerializer


# I Added this stuff --------------------------------------

class PhotoList(generics.ListCreateAPIView):
    """List all Locations or create a new Location"""
    #permission_classes = (permissions.IsAuthenticated,)
    model = Photo
    serializer_class = PhotoSerializer


class PhotoDetail(generics.RetrieveUpdateDestroyAPIView):
    """List all Locations or create a new Location"""
    #permission_classes = (permissions.IsAuthenticated,)
    model = Photo
    serializer_class = PhotoSerializer


class LocationList(generics.ListCreateAPIView):
    """List all Locations or create a new Location"""
    #permission_classes = (permissions.IsAuthenticated,)
    model = Location
    serializer_class = LocationSerializer


class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    """List all Locations or create a new Location"""
    #permission_classes = (permissions.IsAuthenticated,)
    model = Location
    serializer_class = LocationSerializer


class CommentList(generics.ListCreateAPIView):
    """List all Locations or create a new Location"""
    permission_classes = (permissions.IsAuthenticated,)
    model = Comment
    serializer_class = CommentSerializer
    # queryset = Comment.objects.filter(locationPostID = location_id)

    # def get(self, request):
    #     print "%s" % request.QUERY_PARAMS['locationID']
    #     location_id = request.QUERY_PARAMS['locationID']
    #     return query_set

# I Added the stuff above --------------------------------------


@api_view(('GET',))
def comments_by_location(request):
    location_id = request.QUERY_PARAMS['locationID']
    queryset = Comment.objects.filter(locationPostID=location_id)
    serializer_class = CommentSerializer(queryset)

        # print "%s" % request.QUERY_PARAMS['locationID']
    return Response(serializer_class.data)


@api_view(('POST',))
def authenticate(request):
    c = {}
    c.update(csrf(request))

    username = request.POST.get('username', request.DATA['username'])  # emtpy string if no username exists
    password = request.POST.get('password', request.DATA['password'])  # empty string if no password exists

    user = auth.authenticate(username=username, password=password)

    if user is not None:
        auth.login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
    else:
        c['message'] = 'Login failed!'
        return render_to_response('partials/login.tpl.html', c)


@api_view(('GET',))
def obtain_user_from_token(r, token):
   auth = TokenAuthentication()
   response = auth.authenticate_credentials(token)
   user_id = response[0].id
   return Response(user_id)


@api_view(('GET',))
def uploadedimages(request, event_id):
    photo = Photo.objects.get(id=event_id)
    photo_name = photo.photo.name.split("/")[-1]
    # if request.method == 'GET':
    #     logo = Logo.objects.get(consultant_id=company.consultant_id)
    if request.is_secure():
        photo_url = ''.join(['https://', request.META['HTTP_HOST'], '/static/', photo_name])
    else:
        photo_url = ''.join(['http://', request.META['HTTP_HOST'], '/static/', photo_name])

    response = [photo_url, event_id]
    return Response(response)


@api_view(['GET', 'PUT', 'POST', 'DELETE'])
def votes(request):

    votes_list = None
    vote = None
    up = None
    down = None

    if 'is_up' in request.DATA and request.DATA['is_up'] is not None:
        up = Vote.objects.get(id=request.POST.get('is_up', request.DATA['is_up']))

    if 'is_down' in request.DATA and request.DATA['is_down'] is not None:
        down = Vote.objects.get(id=request.POST.get('is_down', request.DATA['is_down']))

    if 'id' in request.DATA and request.DATA['id'] is not None:
        vote = Vote.objects.get(id=request.POST.get('id', request.DATA['id']))

    if 'user_id' in request.DATA and request.DATA['user_id'] is not None:
        if 'event_id' in request.DATA and request.DATA['event_id'] is not None:
            votes_list = Vote.objects.filter(event_id=request.POST.get('event_id', request.DATA['event_id']),
                                             user_id=request.POST.get('user_id', request.DATA['user_id']))

    else:
        votes_list = Vote.objects.all()

    if request.method == 'GET':
        serialize = VoteSerializer(votes_list)
        return Response(serialize.data)

    elif request.method == 'PUT':
        vote = Vote.objects.get(id=request.POST.get('id', request.DATA['id']))

        vote.is_up = up
        vote.is_down = down
        vote.user_id = request.POST.get('user_id', request.DATA['user_id'])
        vote.event_id = request.POST.get('event_id', request.DATA['event_id'])

        vote.save()

        return Response(status=status.HTTP_201_CREATED)

    elif request.method == 'POST':
        event = Location.objects.get(id=request.POST.get('event_id', request.DATA['event_id']))
        user = User.objects.get(id=request.POST.get('user_id', request.DATA['user_id']))

        new_vote = Vote(is_up=up, is_down=down, event_id=event, user_id=user)

        new_vote.save()

        return Response(status=status.HTTP_201_CREATED)

    else:
        vote = Vote.objects.get(id=request.POST.get('id', request.DATA['id']))
        vote.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'PUT', 'POST', 'DELETE'])
def social_accounts(request):

    social_list = None
    social = None
    facebook = None
    twitter = None
    google = None

    if 'facebook' in request.DATA and request.DATA['facebook'] is not None:
        facebook = request.POST.get('facebook', request.DATA['facebook'])

    if 'twitter' in request.DATA and request.DATA['twitter'] is not None:
        twitter = request.POST.get('twitter', request.DATA['twitter'])

    if 'google' in request.DATA and request.DATA['google'] is not None:
        google = request.POST.get('twitter', request.DATA['google'])

    if 'id' in request.DATA and request.DATA['id'] is not None:
        social = Social.objects.get(id=request.POST.get('id', request.DATA['id']))

    if 'user_id' in request.DATA and request.DATA['user_id'] is not None:
        social_list = Vote.objects.filter(user_id=request.POST.get('user_id', request.DATA['user_id']))

    else:
        social_list = Social.objects.all()

    if request.method == 'GET':
        serialize = SocialSerializer(social_list)
        return Response(serialize.data)

    elif request.method == 'PUT':
        social = Social.objects.get(id=request.POST.get('id', request.DATA['id']))

        social.facebook_url = facebook
        social.google_plus = google
        social.twitter_handle = twitter

        social.save()

        return Response(status=status.HTTP_201_CREATED)

    elif request.method == 'POST':
        user = User.objects.get(id=request.POST.get('user_id', request.DATA['user_id']))

        new_social = Social(facebook_url=facebook, google_plus=google, twitter_handle=twitter, user_id=user)

        new_social.save()

        return Response(status=status.HTTP_201_CREATED)

    else:
        social = Social.objects.get(id=request.POST.get('id', request.DATA['id']))
        social.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


def logout(request):
    auth.logout(request)
    return JSONResponse([{'success': 'Logged out!'}])


class NewAuthToken(ObtainAuthToken):
    def post(self, request):
        serializer = self.serializer_class(data=request.DATA)
        if serializer.is_valid():
            token, created = Token.objects.get_or_create(user=serializer.object['user'])
            data = {
                'user': UserSerializer(User.objects.filter(auth_token=token)).data,
                'token': token.key,
            }
            return Response(data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)