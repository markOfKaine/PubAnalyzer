from django.urls import path
from .views import RegisterView, SessionLoginView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', SessionLoginView.as_view(), name='session_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]