from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Profile(models.Model):

    user = models.OneToOneField(User,on_delete=models.CASCADE)
    secret = models.CharField(max_length=100, blank=True, verbose_name="secret_key", db_index=True)
    public_key = models.CharField(max_length=767, blank=True, verbose_name="public_key", db_index=True)
    public_key_passphrase = models.CharField(max_length=100, blank=True, verbose_name="ssh_passphrase", db_index=True)

    picture = models.URLField(blank=True, verbose_name="User Avatar / Company Logo")
    first_login = models.BooleanField(default=False)
