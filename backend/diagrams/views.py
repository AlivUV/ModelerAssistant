"""Views for the digrams app"""
from rest_framework.decorators import api_view
from core.crud.standard import Crud

from .models import Diagram
from .serializers import DiagramSerializer

# Create your views here.

crudObject = Crud(DiagramSerializer, Diagram)


@api_view(['POST'])
def create(request):
    diagramCreate = crudObject.create(request)
    return diagramCreate


@api_view(['GET'])
def get(request, diagramId):
    diagramGet = crudObject.get(request, diagramId)
    return diagramGet


@api_view(['GET'])
def list(request, projectId):
    diagramList = crudObject.list(request, "project", projectId)
    return diagramList


@api_view(['PUT'])
def update(request, diagramId):
    diagramUpdate = crudObject.update(request, diagramId)
    return diagramUpdate


@api_view(['DELETE'])
def delete(request, diagramId):
    diagramDelete = crudObject.delete(
        diagramId, 'The diagram has been successfully removed')
    return diagramDelete
