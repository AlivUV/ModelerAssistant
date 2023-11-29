from django.urls import include, path
from . import views

urlpatterns = [
    path('gpt/', views.gpt, name='asisstantGPT'),
    path('bard/', views.bard, name='asisstantBard')
]