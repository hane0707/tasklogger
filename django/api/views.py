from django.db import models
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
  model = Task
  serializer_class = TaskSerializer
  queryset = Task.objects.all()
  permission_classes = (AllowAny, )
