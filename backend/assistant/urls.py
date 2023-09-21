from django.urls import include, path
from . import views

urlpatterns = [
    path('autocomplete/', views.autocomplete, name='asisstantAutocomplete')
]