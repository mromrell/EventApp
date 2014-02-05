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

    url(r'^users$', UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)$', UserDetail.as_view(), name='user-detail'),
    url(r'^uploadedimages/(?P<event_id>.+)$', uploadedimages, name='uploadedimages'),

    url(r'^location$', LocationList.as_view(), name='location-list'),
    url(r'^location-detail/(?P<pk>[0-9]+)$', LocationDetail.as_view(), name='location-detail'),
    url(r'^comment$', CommentList.as_view(), name='comment-list'),
    url(r'^comments-by-location$', comments_by_location, name='comments-by-location'),
    # url(r'^starlist$', StarList.as_view(), name='star-list'),
    url(r'^getuserid/(?P<token>.+)$', obtain_user_from_token, name='getUserId'),
    # url(r'^location/(?P<pk>[0-9]+)$', LocationDetail.as_view(), name='location-Detail'),
    url(r'^photo$', PhotoList.as_view(), name='photo-list'),
    url(r'^photo-detail/(?P<pk>[0-9]+)$', PhotoDetail.as_view(), name='photo-detail'),

    url(r'^votes$', votes, name='votes-api'),
    url(r'^social', social_accounts, name='social-api'),

)

# urlpatterns += patterns('', url(r'^api-token-auth/', 'rest_framework.authtoken.views.obtain_auth_token'))
urlpatterns += patterns('', url(r'^api-token-auth/', NewAuthToken.as_view(), name='NewAuthToken'))

urlpatterns = format_suffix_patterns(urlpatterns)