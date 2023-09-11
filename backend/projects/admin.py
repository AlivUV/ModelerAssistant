from django.contrib import admin

from django.contrib import admin
from diagrams.models import Project

class ProjectAdmin(admin.ModelAdmin):
    pass
admin.site.register(Project, ProjectAdmin)
# Register your models here.

