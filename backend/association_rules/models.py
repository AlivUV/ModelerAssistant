from django.db import models
# Create your models here.


class BaseGroup(models.Model):
    group_id = models.TextField()
    sentence = models.TextField()
    creation_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'base_groups'


class ResultGroup(models.Model):
    group_id = models.TextField()
    sentence = models.TextField()
    creation_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'result_groups'


class AssociationRule(models.Model):
    base_group_id = models.TextField()
    result_group_id = models.TextField()
    creation_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'association_rules'
