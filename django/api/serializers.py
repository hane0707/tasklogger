from rest_framework import serializers
from .models import Tasks

class TasksSerializer(serializers.ModelSerializer):

  class Meta:
    model = Tasks
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
