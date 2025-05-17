from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pmcIntegration.PMCService import PMCService 
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class PMCFetchView(APIView):
    def post(self, request):
        pmcid = request.data.get("pmcid")
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