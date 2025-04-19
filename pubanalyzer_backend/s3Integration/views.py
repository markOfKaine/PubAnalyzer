from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render
from .S3Service import S3Service
import logging
import json


@method_decorator(csrf_exempt, name='dispatch')
class ListArticlesView(View):
    def get(self):
        try:
            s3_service = S3Service()
            articles = s3_service.list_articles()
            logging.info(f"Articles listed successfully: {articles}")
            return JsonResponse(articles, safe=False)
        except Exception as e:
            logging.error(f"Error listing articles: {e}")
            return JsonResponse({'error': str(e)}, status=500)