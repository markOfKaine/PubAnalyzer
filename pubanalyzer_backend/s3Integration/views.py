from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .S3Service import S3Service
from Managers.DocManager import DocManager
import logging
import json


@method_decorator(csrf_exempt, name='dispatch')
class ListArticlesView(View):
    def get(self, request):
        try:
            s3_service = S3Service()
            articles = s3_service.list_articles()
            logging.info(f"Articles listed successfully: {articles}")
            return JsonResponse(articles, safe=False)
        except Exception as e:
            logging.error(f"Error listing articles: {e}")
            return JsonResponse({'error': str(e)}, status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class UploadArticleView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            file_name = data.get('file_name')
            file_content = data.get('file_content')
            
            if not file_name or not file_content:
                return JsonResponse({'error': 'file_name and file_content are required.'}, status=400)
            
            ##send to docManager to check if the file is a duplicate
            docManager = DocManager()
            docManager.add_document(file_name, file_content)
            logging.info(f"File {file_content} uploaded successfully as {file_name}.")
            return JsonResponse({'message': 'File uploaded successfully.'})
        except Exception as e:
            logging.error(f"Error uploading file: {e}")
            return JsonResponse({'error': str(e)}, status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class DownloadArticleView(View):
    def get(self, request):
        try:
            file_name = json.loads(request.body).get('file_name')
                
            if not file_name:
                return JsonResponse({'error': 'file_name is required.'}, status=400)
            
            docManager = DocManager()
            file = docManager.get_document(file_name)
                
            if file:
                logging.info(f"File {file_name} downloaded successfully.")
                return JsonResponse({'file_content': file})
            else:
                return JsonResponse({'error': 'File not found.'}, status=404)
        except Exception as e:
            logging.error(f"Error downloading file: {e}")
            return JsonResponse({'error': str(e)}, status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class DeleteArticleView(View):
    def delete(self, request):
        try:
            data = json.loads(request.body)
            file_name = data.get('file_name')
            admin = data.get('admin', False)
            
            if not file_name:
                return JsonResponse({'error': 'file_name is required.'}, status=400)
            
            docManager = DocManager()
            docManager.remove_document(file_name, admin)
            
            logging.info(f"File {file_name} deleted successfully.")
            return JsonResponse({'message': 'File deleted successfully.'})
        except Exception as e:
            logging.error(f"Error deleting file: {e}")
            return JsonResponse({'error': str(e)}, status=500)
