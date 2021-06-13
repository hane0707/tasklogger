from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):

  class Meta:
    model = Task
    fields = (
      "id",
      "title",
      "details",
      "start_date",
      "start_time",
      "end_date",
      "end_time",
      "created_at",
    )
