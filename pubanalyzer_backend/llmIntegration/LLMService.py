from .llmServices.OpenAIService import OpenAIService
from .llmServices.GeminiService import GeminiService
from .llmServices.SeekService import SeekService

class LLMService:
    def __init__(self, provider='openai'):
        if provider == 'openai':
            self.service = OpenAIService()
        elif provider == 'gemini':
            self.service = GeminiService()
        elif provider == 'seek':
            self.service = SeekService()
        else:
            raise ValueError(f"Unsupported LLM provider: {provider}")
        
    def imageEncoding(self, file_obj):
        return self.service.imageEncoding(file_obj)

    def generateResponse(self, prompt, image=None):
        return self.service.generateResponse(prompt, image)
