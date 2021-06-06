from django.db import models
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Tasks
from .serializers import TasksSerializer

class TasksViewSet(viewsets.ModelViewSet):
  model = Tasks
  serializer_class = TasksSerializer
  queryset = Tasks.objects.all()
  permission_classes = (AllowAny, )
