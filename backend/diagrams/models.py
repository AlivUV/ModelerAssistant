from django.db import models
from projects.models import Project
from django.contrib.auth.models import User
# Create your models here.


class Diagram(models.Model):
    """Model to represent a diagram"""
    name = models.TextField()
    description = models.TextField(null=True, blank=True)
    xml = models.TextField()
    svg = models.TextField(default='Nothing')
    json_user_histories = models.JSONField(null=True, blank=True)
    id_project = models.ForeignKey(
        Project, null=True, blank=True, on_delete=models.CASCADE, db_column='id_project')
    creation_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'diagrams'
