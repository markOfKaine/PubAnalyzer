from django.test import TestCase
from django.contrib.auth.models import User
from .serializers import UserSerializer


class UserSerializerTests(TestCase):
    """Tests for the :class:`UserSerializer`."""

    def _get_valid_payload(self, **overrides):
        data = {
            "username": "tester",
            "email": "TEST@EXAMPLE.COM",
            "password": "strongpassword",
            "first_name": "john",
            "last_name": "doe",
        }
        data.update(overrides)
        return data

    def test_create_user_normalizes_fields(self):
        serializer = UserSerializer(data=self._get_valid_payload())
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()

        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.last_name, "Doe")
        self.assertEqual(user.email, "test@example.com")

    def test_invalid_first_name_raises_error(self):
        serializer = UserSerializer(data=self._get_valid_payload(first_name="john1"))
        self.assertFalse(serializer.is_valid())
        self.assertIn("first_name", serializer.errors)

    def test_invalid_last_name_raises_error(self):
        serializer = UserSerializer(data=self._get_valid_payload(last_name="doe2"))
        self.assertFalse(serializer.is_valid())
        self.assertIn("last_name", serializer.errors)

    def test_validate_email_lowercases(self):
        serializer = UserSerializer()
        self.assertEqual(serializer.validate_email("Foo@Bar.COM"), "foo@bar.com")

    def test_duplicate_email_fails_validation(self):
        User.objects.create_user(username="existing", email="test@example.com", password="pass1234")
        serializer = UserSerializer(data=self._get_valid_payload(username="tester2", email="test@example.com"))
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_password_is_hashed(self):
        serializer = UserSerializer(data=self._get_valid_payload())
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertTrue(user.check_password("strongpassword"))