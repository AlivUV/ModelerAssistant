"""Standard functions for crud"""
from dataclasses import field
from typing import Callable
from django.db.models import query
from django.db.models.query import QuerySet
from rest_framework import status
from rest_framework.response import Response
from core.crud.exeptions import NonCallableParam
from django.db.models import Model
from rest_framework.serializers import Serializer
import datetime


class Crud():
    """Manages the standard functions for crud in modules"""

    def __init__(self, serializer_class: Serializer, model_class: Model):
        self.serializer_class = serializer_class
        self.model_class = model_class

    def save_instance(self, data, identifier=0):
        """Saves a model intance"""
        if identifier:
            model_obj = self.model_class.objects.get(pk=identifier)
            data_serializer = self.serializer_class(model_obj, data=data)
        else:
            data_serializer = self.serializer_class(data=data)

        if data_serializer.is_valid():
            model_obj = data_serializer.save()
            return {"success": True, "id": model_obj.pk}, status.HTTP_201_CREATED

        answer = self.error_data(data_serializer)
        return answer, status.HTTP_400_BAD_REQUEST

    def create(self, request):
        """Tries to create a row in the database and returns the result"""
        if hasattr(request, 'data'):
            data = request.data
        else:
            data = request

        data = self.set_date(data.copy(), [
                             'creation_date', 'update_date'])
        answer, answer_status = self.save_instance(data)
        return Response(answer, status=answer_status, content_type='application/json')

    def get(self, request, identifier):
        """Return a JSON response with data for the given id"""
        try:
            model_obj = self.model_class.objects.get(pk=identifier)
            data_serializer = self.serializer_class(model_obj)
            model_data = data_serializer.data.copy()

            data = {
                "success": True,
                "data": model_data
            }

            return Response(data, status=status.HTTP_200_OK)
        except self.model_class.DoesNotExist:
            data = {
                "success": False,
                "error": "The record does not exist, it may have been deleted recently"
            }
            return Response(data, status=status.HTTP_404_NOT_FOUND)

    def list(self, request, field_filter, fieldId):
        """ Returns a JSON response containing registered users"""
        if(field_filter == "project"):
            queryset = self.model_class.objects.filter(
                id_project=fieldId).order_by('id')
            result = self.serializer_class(queryset, many=True)
        else:
            queryset = self.model_class.objects.filter(
                user_id=fieldId).order_by('id')
            result = self.serializer_class(queryset, many=True)

        data = {
            'success': True,
            'data': result.data
        }
        return Response(data, status=status.HTTP_200_OK)

    def update(self, request, identifier):
        """Tries to update a row in the db and returns the result"""
        data = self.set_date(request.data.copy(), ['update_date'])
        answer, answer_status = self.save_instance(data, identifier)
        return Response(answer, status=answer_status)

    def delete(self, identifier, message):
        """Tries to delete a row from db and returns the result"""
        try:
            model_obj = self.model_class.objects.get(id=identifier)
            model_obj.delete()
            data = {
                "success": True,
                "message": message
            }
            return Response(data, status=status.HTTP_200_OK)
        except self.model_class.DoesNotExist:
            data = {
                "success": False,
                "error": "The record does not exist, it may have been deleted recently"
            }
            return Response(data, status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def set_date(data, attributes):
        """Return data with creation date or/and update date"""
        for attribute in attributes:
            data[attribute] = datetime.datetime.now()
        return data

    @staticmethod
    def error_data(serializer):
        """Return a common JSON error result"""
        error_details = {}
        for key in serializer.errors.keys():
            error_details[key] = serializer.errors[key]

        data = {
            "succes": False,
            "Error": {
                "success": False,
                "message": "The data sent are not valid",
                "details": error_details
            }
        }
        return error_details

    @staticmethod
    def validate_function(f):
        """Checks if the given parameter is a function"""
        if f is None:
            return False
        if callable(f):
            return True
        raise NonCallableParam
