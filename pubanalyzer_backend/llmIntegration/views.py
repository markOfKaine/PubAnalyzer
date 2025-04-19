from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render
from .SeekService import SeekService
import logging
import json

    ##TODO SET UP LOGGING

@method_decorator(csrf_exempt, name='dispatch')
class generateLLMResponse(View):
    def post(self, request):
        try:
            body = json.loads(request.body)
            prompt = body.get('prompt', '')
            seekService = SeekService()
            response = seekService.generateResponse(prompt)
            logging.info(f"Response created successfully.")
            return JsonResponse(response, safe=False)
        except Exception as e:
            logging.error(f"Error obtaining response: {e}")
            return JsonResponse({'error': str(e)}, status=500)
        
