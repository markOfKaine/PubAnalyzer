from django.urls import path
from .views import RegisterView, SessionLoginView, LogoutView, UserAuthView, AnnotatedStudiesView, FavoriteStudiesView, CSRFTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', SessionLoginView.as_view(), name='session_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('auth/status/', UserAuthView.as_view(), name='auth'),
    path('annotated_studies/', AnnotatedStudiesView.as_view(), name='annotated_studies'),
    path('favorite_studies/', FavoriteStudiesView.as_view(), name='favorite_studies'),
    path('csrf/', CSRFTokenView.as_view(), name='get_csrf_token')
]