from rest_framework import serializers
from .models import Diagram
import json


class DiagramSerializer(serializers.ModelSerializer):
    json_user_histories = serializers.JSONField()

    class Meta:
        model = Diagram
        fields = ['id', 'name', 'description', 'xml', 'svg', 'json_user_histories', 'id_project', 'creation_date',
                  'update_date']
