"""
URL configuration for pubanalyzer_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to the PubAnalyzer API"})

urlpatterns = [
    path('', home),  # Root URL returns simple message
    path('admin/', admin.site.urls),
    path('api/', include('docs.urls')),  # Include /api/ prefix
    path('s3/', include('s3Integration.urls')),  # Include /s3/ prefix for s3Integration
    path('pmc/', include('pmcIntegration.urls')),  # Include /pmc/ prefix for pmcIntegration
    path('llm/', include('llmIntegration.urls')),  # Include /llm/ prefix for llmIntegration
    path('rds/', include('rdsIntegration.urls')),  # Include /rds/ prefix for rdsIntegration
]
