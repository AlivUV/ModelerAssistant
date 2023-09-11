# Django REST Framework
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response


# Serializers
from users.serializers import UserLoginSerializer, UserModelSerializer, UserSignUpSerializer

# Models
from django.contrib.auth.models import User


class UserViewSet(viewsets.GenericViewSet):

    queryset = User.objects.filter(is_active=True)
    serializer_class = UserModelSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, token = serializer.save()
        data = {
            'user': UserModelSerializer(user).data,
            'access_token': token
        }
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def signup(self, request):
        serializer = UserSignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = UserModelSerializer(user).data
        return Response(data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def getFullName(request, userId):
    modelUser = User.objects.get(pk=userId)
    user = UserModelSerializer(modelUser).data
    fullname = {
        'firstName': user['first_name'],
        'lastName': user['last_name']
    }
    return Response(fullname, status=status.HTTP_201_CREATED)
