# Generated by Django 3.2.3 on 2021-06-12 04:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasks',
            name='title',
            field=models.CharField(blank=True, default='no title', max_length=30, verbose_name='タイトル'),
        ),
    ]
