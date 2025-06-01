from django.db import models
from django.contrib.auth.models import User

class Study(models.Model):
    study_id = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=512, blank=True)
    abstract = models.TextField(blank=True)

    def __str__(self):
        return self.title or self.study_id


class UserStudies(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='studies')
    annotated_studies = models.ManyToManyField(Study, blank=True, related_name='annotated_by')
    favorite_studies = models.ManyToManyField(Study, blank=True, related_name='favorited_by')

    def __str__(self):
        return f"Annotations for {self.user.username}"

