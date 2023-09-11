"""Views for the projects app"""
from rest_framework.decorators import api_view
from core.crud.standard import Crud

from .models import Project
from .serializers import ProjectSerializer

# Create your views here.

crudObject = Crud(ProjectSerializer, Project)


@api_view(['POST'])
def create(request):
    projectCreate = crudObject.create(request)
    return projectCreate


@api_view(['GET'])
def get(request, projectId):
    projectGet = crudObject.get(request, projectId)
    return projectGet


@api_view(['GET'])
def list(request, userId):
    projectList = crudObject.list(request, "user", userId)
    return projectList


@api_view(['PUT'])
def update(request, projectId):
    projectUpdate = crudObject.update(request, projectId)
    return projectUpdate


@api_view(['DELETE'])
def delete(request, projectId):
    projectDelete = crudObject.delete(
        projectId, 'The project has been successfully removed')
    return projectDelete
