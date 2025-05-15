from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pmcIntegration.PMCService import PMCService 

class PMCFetchView(APIView):
    def post(self, request):
        pmcid = request.data.get("pmcid")
        if not pmcid:
            return Response({"error": "PMCID is required"}, status=400)

        url = PMCService().download_extract_and_upload(pmcid)
        if url:
            return Response({"message": f"Successfully processed {pmcid}", "url": url})
        else:
            return Response({"error": f"Failed to process {pmcid}"}, status=500)