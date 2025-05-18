from django.urls import path
from .views import RegisterView, SessionLoginView, LogoutView, UserAuthView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', SessionLoginView.as_view(), name='session_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('auth/status/', UserAuthView.as_view(), name='auth'),
]