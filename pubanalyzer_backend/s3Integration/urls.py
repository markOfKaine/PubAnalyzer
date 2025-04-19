from django.urls import path
from .views import ListArticlesView

urlpatterns = [
    path('s3/list/', ListArticlesView.as_view(), name='list_articles'),
]