from django.urls import path
from .views import AddUserView

urlpatterns = [
    path('add-user/', AddUserView.as_view(), name='add_user'),
]
