from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.utils.decorators import method_decorator
from .S3Service import S3Service
from pmcIntegration.DocManager import DocManager
import logging
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class UploadAnnotationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            userID = request.data.get('userID')
            pmcID = request.data.get('pmcID')
            file_content = request.data.get('file_content')
            
            if not userID or not pmcID or not file_content:
                return Response({'error': 'userID, pmcID, and file_content are required.'}, 
                                    status=status.HTTP_400_BAD_REQUEST)
            
            s3Key = f"annotations/{userID}/{pmcID}.json"

            s3_service = S3Service()
            s3_service.upload_annotation(s3Key, file_content)
            return Response({'message': 'Annotation uploaded successfully.'})
        except Exception as e:
            logging.error(f"Error uploading annotation: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DownloadAnnotationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):        
        try:
            userID = request.query_params.get('userID')
            pmcID = request.query_params.get('pmcID')
            
            if str(request.user.id) != userID:
                return Response(
                    {'error': 'You can only access your own annotations'}, 
                    status=status.HTTP_403_FORBIDDEN)
            
            if not userID or not pmcID:
                return Response({'error': 'userID and pmcID are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            s3Key = f"annotations/{userID}/{pmcID}.json"
            s3_service = S3Service()
            annotations = s3_service.get_annotations(s3Key)
            
            if annotations is None:
                return Response({'error': 'No annotations found.'}, status=status.HTTP_404_NOT_FOUND)
            
            return Response(annotations)
        except Exception as e:
            logging.error(f"Error retrieving annotations: {e}")
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class DeleteAnnotationView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            userID = request.data.get('userID')
            pmcID = request.data.get('pmcID')
            file_content = request.data.get('file_content')
            
            if not userID or not pmcID or not file_content:
                return Response({'error': 'userID, pmcID, and file_content are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            s3Key = f"annotations/{userID}/{pmcID}.json"

            s3_service = S3Service()
            s3_service.delete_annotation(s3Key, file_content)
            return Response({'message': 'Annotation deleted successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error deleting annotation: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@method_decorator(csrf_exempt, name='dispatch')
class DeleteAllAnnotationsView(View):
    def delete(self, request):
        try:
            userID = request.GET.get('userID')
            pmcID = request.GET.get('pmcID')
            
            if not userID or not pmcID:
                return JsonResponse({'error': 'userID and pmcID are required.'}, status=400)
            
            s3Key = f"annotations/{userID}/{pmcID}.json"

            s3_service = S3Service()
            s3_service.delete_annotations(s3Key)
            return JsonResponse({'message': 'All annotations deleted successfully.'})
        except Exception as e:
            logging.error(f"Error deleting all annotations: {e}")
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
