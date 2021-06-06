import uuid
from datetime import datetime as dt
from datetime import date
from django.db import models

class Tasks(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  title = models.CharField(verbose_name='タイトル', blank=False, null=False, max_length=30, default='no title')
  details = models.TextField(verbose_name='詳細', blank=True, null=True, max_length=1000)
  start_date = models.DateField(verbose_name='開始日', blank=True, null=False, default=date.today)
  start_time = models.TimeField(verbose_name="開始時間", blank=True, null=False, default=dt.now)
  end_date =  models.DateField(verbose_name='終了日', blank=True, null=True)
  end_time = models.TimeField(verbose_name="終了時間", blank=True, null=True)
  created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)

  def __str__(self):
      return self.title

  class Meta:
    ordering = ['-start_date', '-start_time', '-created_at']
