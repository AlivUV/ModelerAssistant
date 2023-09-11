# Django
from django.contrib.auth import password_validation, authenticate
from django.core.validators import RegexValidator, FileExtensionValidator
from django.http import JsonResponse

# Django REST Framework
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueValidator
#Models
from django.contrib.auth.models import User

class UserModelSerializer(serializers.ModelSerializer):

    class Meta:

        model = User
        fields = (
            'id',
            'username',
            'password',
            'email',
            'first_name',
            'last_name'
        )

class UserLoginSerializer(serializers.Serializer):

    # Required Fields
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, max_length=64)

    # Validate data
    def validate(self, data):

        # authenticate user
        user = authenticate(username=data['username'], password=data['password'])
        if user is None:
            raise serializers.ValidationError('Incorrect data')
        else:
        # Context provided access to the token user
            self.context['user'] = user
            return data

    def create(self, data):
        #generate or get Token
        token, created = Token.objects.get_or_create(user=self.context['user'])
        return self.context['user'], token.key

#create a user
class UserSignUpSerializer(serializers.Serializer):

    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        min_length=4,
        max_length=20,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(min_length=8, max_length=64)
    password_confirmation = serializers.CharField(min_length=8, max_length=64)

    first_name = serializers.CharField(min_length=2, max_length=50)
    last_name = serializers.CharField(min_length=2, max_length=100)

    def validate(self, data):
        passwd = data['password']
        passwd_conf = data['password_confirmation']
        if passwd != passwd_conf:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        password_validation.validate_password(passwd)

        return data

    def create(self, data):
        data.pop('password_confirmation')
        user = User.objects.create_user(**data)
        return user