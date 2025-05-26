from django.db import models
from django.contrib.auth.models import User

class UserStudies(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='studies')
    annotated_studies = models.JSONField(default=list)  # use ArrayField if you’re using PostgreSQL

    def __str__(self):
        return f"Profile for {self.user.username}"
