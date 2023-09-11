
from django.urls import include, path
from . import views

urlpatterns = [
    path('create/', views.create, name='diagramCreate'),
    path('get/<int:diagramId>', views.get, name='diagramGet'),
    path('list/<int:projectId>', views.list, name='diagramList'),
    path('update/<int:diagramId>', views.update, name='diagramUpdate'),
    path('delete/<int:diagramId>', views.delete, name='diagramDelete'),
]
