from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .S3Service import S3Service
from pmcIntegration.DocManager import DocManager
import logging
import json

@method_decorator(csrf_exempt, name='dispatch')
class UploadAnnotationView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            userID = request.GET.get('userID')
            pmcID = request.GET.get('pmcID')
            file_content = data.get('file_content')
            
            if not userID or not pmcID or not file_content:
                return JsonResponse({'error': 'userID, pmcID, and file_content are required.'}, status=400)
            
            s3Key = f"annotations/{userID}/{pmcID}.json"

            s3_service = S3Service()
            s3_service.upload_annotation(s3Key, file_content)
            return JsonResponse({'message': 'Annotation uploaded successfully.'})
        except Exception as e:
            logging.error(f"Error uploading annotation: {e}")
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class DownloadAnnotationView(View):
    def get(self, request):
        try:
            userID = request.GET.get('userID')
            pmcID = request.GET.get('pmcID')
            
            if not userID or not pmcID:
                return JsonResponse({'error': 'userID and pmcID are required.'}, status=400)
            
            s3Key = f"annotations/{userID}/{pmcID}.json"
            s3_service = S3Service()
            annotations = s3_service.get_annotations(s3Key)
            
            if annotations is None:
                return JsonResponse({'error': 'No annotations found.'}, status=404)
            
            return JsonResponse(annotations, safe=False)
        except Exception as e:
            logging.error(f"Error retrieving annotations: {e}")
            return JsonResponse({'error': str(e)}, status=500)

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
            file_name = data.get('file_name') ##filename should be unique (userID + pmcID)
            file_content = data.get('file_content')
            
            if not file_name or not file_content:
                return JsonResponse({'error': 'file_name and file_content are required.'}, status=400)
            
            ##send to docManager to check if the file is a duplicate
            docManager = DocManager._instance()
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
        
# @method_decorator(csrf_exempt, name='dispatch')
# class DeleteArticleView(View):
#     def delete(self, request):
#         try:
#             data = json.loads(request.body)
#             file_name = data.get('file_name')
#             admin = data.get('admin', False)
            
#             if not file_name:
#                 return JsonResponse({'error': 'file_name is required.'}, status=400)
            
#             docManager = DocManager()
#             docManager.remove_document(file_name, admin)
            
#             logging.info(f"File {file_name} deleted successfully.")
#             return JsonResponse({'message': 'File deleted successfully.'})
#         except Exception as e:
#             logging.error(f"Error deleting file: {e}")
#             return JsonResponse({'error': str(e)}, status=500)
