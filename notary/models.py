from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Submissions(models.Model):
    file_name=models.CharField(max_length=255)
    file_mime_type=models.CharField(max_length=100)
    file_size=models.IntegerField()
    file_last_modified=models.CharField(max_length=100)
    file_hash=models.CharField(max_length=66)
    transaction_hash=models.CharField(max_length=256, default="")
    transaction_created_at=models.DateTimeField(auto_now=True)
    has_proof=models.BooleanField()
