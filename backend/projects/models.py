from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    name = models.TextField()
    user_id = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.DO_NOTHING, db_column='user_id')
    creation_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        db_table = 'projects'
