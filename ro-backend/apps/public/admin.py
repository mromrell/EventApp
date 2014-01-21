from django.contrib import admin
from .models import *


class AddressAdmin(admin.ModelAdmin):
    ''' Admin layout for Address'''
    pass

''' Register Admin layouts into django'''
admin.site.register(Address, AddressAdmin)
admin.site.register(Location)
admin.site.register(Comment)
admin.site.register(ExtendedUser)