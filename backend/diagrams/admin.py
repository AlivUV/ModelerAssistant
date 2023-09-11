from django.contrib import admin
from diagrams.models import Diagram

class DiagramAdmin(admin.ModelAdmin):
    pass
admin.site.register(Diagram, DiagramAdmin)
# Register your models here.
