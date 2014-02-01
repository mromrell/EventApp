DEBUG = False

# This should be set to the production domain (e.g. django-angular-pt.com)
ALLOWED_HOSTS = []

from base import *

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = (
    'lit-basin-5948.herokuapp.com',
)