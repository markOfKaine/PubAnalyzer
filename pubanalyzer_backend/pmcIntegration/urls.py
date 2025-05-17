from django.urls import path
from .views import PMCFetchView, PMCDisplayView

urlpatterns = [
    path('fetch/<str:pmcid>', PMCFetchView.as_view(), name='pmc_fetch'),
    path('display/<str:filename>', PMCDisplayView.as_view(), name='pmc_display'),
]