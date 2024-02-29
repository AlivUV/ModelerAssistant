from django.urls import include, path
from . import views

urlpatterns = [
    path('gpt/', views.gpt, name='asisstantGPT')
]