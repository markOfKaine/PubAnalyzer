from django.urls import path
from .views import DownloadAnnotationView, ListArticlesView, UploadAnnotationView, UploadArticleView, DownloadArticleView, DeleteAnnotationView
#,DeleteArticleView

urlpatterns = [
    path('uploadAnnotation/', UploadAnnotationView.as_view(), name='upload_annotation'),
    path('getAnnotations/', DownloadAnnotationView.as_view(), name='get_annotations'),
    path('deleteAnnotation/', DeleteAnnotationView.as_view(), name='delete_annotation'),
    path('list/', ListArticlesView.as_view(), name='list_articles'),
    path('upload/', UploadArticleView.as_view(), name='upload_article'),
    path('download/', DownloadArticleView.as_view(), name='download_article'),
    # path('delete/', DeleteArticleView.as_view(), name='delete_article'),
]