from django.urls import include, path
from . import views

urlpatterns = [
    path('gpt/', views.gpt, name='asisstantGPT'),
    path('gpt/tunned/', views.gptTunned, name='asisstantGPT-Tunned'),
    path('gemini/', views.geminiPro, name='asisstantGemini')
]