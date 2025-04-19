from django.urls import path
from .views import generateLLMResponse

urlpatterns = [
    path('llm/query/', generateLLMResponse.as_view(), name='generate_llm_response'),
]