from django.urls import path
from .views import UserListCreateView, UserDeleteView

urlpatterns = [
    path('users/', UserListCreateView.as_view()),
    path('users/<int:pk>/', UserDeleteView.as_view()),
]