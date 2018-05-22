from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Submissions(models.Model):

    document_digest = models.CharField(max_length=100, blank=True, verbose_name="secret_key", db_index=True)
    timestamp_string = models.CharField(max_length=20, blank=True, verbose_name="secret_key", db_index=True)

class History(models.Model):
    file_name=models.CharField(max_length=255)
    file_mime_type=models.CharField(max_length=100)
    file_size=models.IntegerField()
    file_last_modified=models.CharField(max_length=100)
    file_hash=models.CharField(max_length=66)
    timestamp=models.DateTimeField(auto_now_add=True),
    has_proof=models.BooleanField()
