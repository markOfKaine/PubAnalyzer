from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pmcIntegration.PMCService import PMCService 
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import FileResponse, Http404
from pathlib import Path

class OriginCheck:
    allowed_origin = "http://localhost:3000" #change to frontend URL in production

    def dispatch(self, request, *args, **kwargs):
        # origin = request.headers.get("Origin") #Uncomment in production
        # if origin != self.allowed_origin:
        #     return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return super().dispatch(request, *args, **kwargs)

@method_decorator(csrf_exempt, name='dispatch')
class PMCFetchView(APIView):
    def get(self, request, pmcid):
        if not pmcid:
            return Response({"error": "PMCID is required"}, status=400)

        pdf_path = PMCService().download_extract_and_upload(pmcid)
        if pdf_path:
            return Response({
                "message": f"Successfully processed {pmcid}",
                "pdf_path": pdf_path
            })
        else:
            return Response({"error": f"Failed to process {pmcid}"}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class PMCDisplayView(APIView):
    def get(self, request, filename):
        pmcid = filename.replace(".pdf", "")
        pdf_dir = Path(__file__).resolve().parent.parent / "Studies/pdfs"
        pdf_path = pdf_dir / filename

        if not pdf_path.exists():
            service = PMCService()
            result = service.download_extract_and_upload(pmcid)
            if not result or not Path(result).exists():
                raise Http404("PDF not found and failed to fetch.")

        return FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')