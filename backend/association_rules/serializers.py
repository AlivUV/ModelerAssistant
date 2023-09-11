from rest_framework import serializers
from .models import AssociationRule, BaseGroup, ResultGroup


class BaseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseGroup
        fields = ['group_id', 'sentence', 'creation_date', 'update_date']


class ResultGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultGroup
        fields = ['group_id', 'sentence', 'creation_date', 'update_date']


class AssociationRuleSerializer(serializers.ModelSerializer):

    class Meta:
        model = AssociationRule
        fields = ['base_group_id', 'result_group_id',
                  'creation_date', 'update_date']
