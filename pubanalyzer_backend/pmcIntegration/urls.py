from django.urls import path
from .views import PMCFetchView

urlpatterns = [
    path('fetch/', PMCFetchView.as_view(), name='pmc_fetch'),
]