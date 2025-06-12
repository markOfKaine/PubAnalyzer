from django.test import SimpleTestCase
from unittest.mock import patch

from .LLMService import LLMService


class LLMServiceTests(SimpleTestCase):
    """Unit tests for :class:`LLMService`."""

    @patch("llmIntegration.LLMService.OpenAIService")
    def test_default_provider_is_openai(self, mock_openai):
        service = LLMService()
        self.assertIs(service.service, mock_openai())

    @patch("llmIntegration.LLMService.GeminiService")
    def test_gemini_provider(self, mock_gemini):
        service = LLMService("gemini")
        self.assertIs(service.service, mock_gemini())

    @patch("llmIntegration.LLMService.SeekService")
    def test_seek_provider(self, mock_seek):
        service = LLMService("seek")
        self.assertIs(service.service, mock_seek())

    def test_invalid_provider_raises(self):
        with self.assertRaises(ValueError):
            LLMService("invalid")

    @patch("llmIntegration.LLMService.OpenAIService")
    def test_image_encoding_delegates_to_service(self, mock_openai):
        instance = mock_openai.return_value
        service = LLMService()
        file_obj = object()
        service.imageEncoding(file_obj)
        instance.imageEncoding.assert_called_with(file_obj)

    @patch("llmIntegration.LLMService.OpenAIService")
    def test_generate_response_delegates_to_service(self, mock_openai):
        instance = mock_openai.return_value
        instance.generateResponse.return_value = "resp"
        service = LLMService()
        result = service.generateResponse("prompt", image="img")
        instance.generateResponse.assert_called_with("prompt", "img")
        self.assertEqual(result, "resp")