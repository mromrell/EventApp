"""
This is your project's master URL configuration, it defines the set of "root" URLs for the entire project
"""
from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *



urlpatterns = patterns(
    'apps.public.views',
    url(r'^api/users/(?P<pk>[0-9]+)/$', UserDetail.as_view(), name='user-detail'),
    url(r'^api/users$', 'authenticate'),
    url(r'^api/user$', 'logout'),

    url(r'^addresses$', AddressList.as_view(), name='address-list'),
    url(r'^addresses/(?P<pk>[0-9]+)$', AddressDetail.as_view(), name='address-detail'),
    url(r'^users$', UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)$', UserDetail.as_view(), name='user-detail'),
    url(r'^uploadedimages/(?P<location_id>.+)$', uploadedimages, name='uploadedimages'),

    url(r'^location$', LocationList.as_view(), name='location-list'),
    url(r'^comment$', CommentList.as_view(), name='comment-list'),
    url(r'^getuserid/(?P<token>.+)$', obtain_user_from_token, name='getUserId'),
    # url(r'^location/(?P<pk>[0-9]+)$', LocationDetail.as_view(), name='location-Detail'),
)

urlpatterns += patterns('', url(r'^api-token-auth/', 'rest_framework.authtoken.views.obtain_auth_token'))

urlpatterns = format_suffix_patterns(urlpatterns)