from django.contrib import admin
from .models import *


''' Register Admin layouts into django'''

admin.site.register(Location)
admin.site.register(Comment)
admin.site.register(Photo)
admin.site.register(Social)
admin.site.register(AccountInfo)
admin.site.register(Payment)
admin.site.register(Vote)