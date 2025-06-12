from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from .models import User


class AddUserViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_add_user_success(self):
        url = reverse('add_user')
        response = self.client.post(url, {'email': 'foo@example.com', 'password': 'secret'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 1)

    def test_add_user_missing_fields(self):
        url = reverse('add_user')
        response = self.client.post(url, {'email': 'foo@example.com'})
        self.assertEqual(response.status_code, 400)