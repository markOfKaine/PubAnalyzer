from django.test import SimpleTestCase
from unittest.mock import patch
import io

from .S3Service import S3Service


class _FakeS3Client:
    """Simple in-memory S3 client used for unit tests."""

    class exceptions:
        class NoSuchKey(Exception):
            pass

    def __init__(self):
        self.objects = {}

    def put_object(self, Bucket, Key, Body, ContentType):
        self.objects[Key] = Body

    def get_object(self, Bucket, Key):
        if Key not in self.objects:
            raise self.exceptions.NoSuchKey()
        return {"Body": io.BytesIO(self.objects[Key].encode())}

    def delete_object(self, Bucket, Key):
        self.objects.pop(Key, None)

    def list_objects_v2(self, Bucket):
        return {"Contents": [{"Key": k} for k in self.objects.keys()]}


class S3ServiceTests(SimpleTestCase):
    """Tests for :class:`S3Service`."""

    @patch("s3Integration.S3Service.boto3.client", return_value=_FakeS3Client())
    def test_upload_and_retrieve_annotation(self, mock_client):
        service = S3Service()
        annotation = {"id": "1", "text": "example"}
        key = "annotations/user/pmc.json"

        service.upload_annotation(key, annotation)
        data = service.get_annotations(key)
        self.assertEqual(data, [annotation])

    @patch("s3Integration.S3Service.boto3.client", return_value=_FakeS3Client())
    def test_delete_annotation(self, mock_client):
        service = S3Service()
        annotation = {"id": "1", "text": "example"}
        key = "annotations/user/pmc.json"

        service.upload_annotation(key, annotation)
        service.delete_annotation(key, annotation)
        self.assertEqual(service.get_annotations(key), [])