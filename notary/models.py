from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Submissions(models.Model):

    document_digest = models.CharField(max_length=100, blank=True, verbose_name="secret_key", db_index=True)
    timestamp_string = models.CharField(max_length=20, blank=True, verbose_name="secret_key", db_index=True)
