from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.utils.decorators import method_decorator
from django.shortcuts import render
from .LLMService import LLMService
import logging
import json
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

    ##TODO SET UP LOGGING

class generateLLMResponse(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            prompt = ''
            image_url = None

            ##can choose from openai, gemini, or seek
            llmService = LLMService("openai")

            if request.content_type.startswith('multipart/form-data'):
                prompt = request.data.get('prompt', '')
                image_file = request.data.get('image')
                if image_file:
                    image_url = llmService.imageEncoding(image_file)
            elif request.content_type == 'application/json':
                prompt = request.data.get('prompt', '')
                image_url = None
                
            response = llmService.generateResponse(prompt, image=image_url)
            logging.info("Response created successfully.")
            return Response({'response': response}, status=status.HTTP_200_OK)

        except Exception as e:
            logging.error(f"Error obtaining response: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

##Summary cannot be implemented with DeepSeek
# @method_decorator(csrf_exempt, name='dispatch')
# class generateLLMSummary(View):
#     def post(self, request):
#         try:
#             body = json.loads(request.body)
#             pmcId = body.get('pmcId', '')
#             seekService = SeekService()
#             response = seekService.generateSummary(pmcId)
#             logging.info(f"Response created successfully.")
#             return JsonResponse(response, safe=False)
#         except Exception as e:
#             logging.error(f"Error obtaining response: {e}")
#             return JsonResponse({'error': str(e)}, status=500)
        
