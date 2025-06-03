from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework import generics
from rest_framework import serializers
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from .models import UserStudies, Study
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

class OriginCheck:
    allowed_origin = "http://localhost:3000" #change to frontend URL in production

    def dispatch(self, request, *args, **kwargs):
        # origin = request.headers.get("Origin") #Uncomment in production
        # if origin != self.allowed_origin:
        #     return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return super().dispatch(request, *args, **kwargs)

class RegisterView(OriginCheck, generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save() #creates user in auth_user table
        UserStudies.objects.create(user=user) #creates user in docs_userstudies table
        login(self.request, user)
        
        return Response({
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'email':user.email,
                'first_name': user.first_name,
            }
        }, status=status.HTTP_201_CREATED)
    
class UserAuthView(OriginCheck, APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'message': 'Authenticated',
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
            })
        return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)


class SessionLoginView(OriginCheck, APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({"error": "Username and password are required."}, status=400)
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(OriginCheck, APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})


class AnnotatedStudiesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)

        study_id = request.data.get("study_id")
        if not study_id:
            return Response({"error": "Missing study_id"}, status=400)

        study, _ = Study.objects.get_or_create(study_id=study_id)
        request.user.studies.annotated_studies.add(study)

        return Response({"message": "Study added"})

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)

        studies = request.user.studies.annotated_studies.all()
        return Response({"annotated_studies": [s.study_id for s in studies]})
    
    
class FavoriteStudiesView(OriginCheck, APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)

        study_id = request.data.get("study_id")
        if not study_id:
            return Response({"error": "Missing study_id"}, status=400)

        study, _ = Study.objects.get_or_create(study_id=study_id)
        request.user.studies.favorite_studies.add(study)

        return Response({"message": "Study favorite"})

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)

        favorites = request.user.studies.favorite_studies.all()
        return Response({"favorite_studies": [s.study_id for s in favorites]})
    
    def delete(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)

        study_id = request.data.get("study_id")
        if not study_id:
            return Response({"error": "Missing study_id"}, status=400)

        try:
            study = Study.objects.get(study_id=study_id)
            request.user.studies.favorite_studies.remove(study)
            return Response({"message": "Study removed from favorites"})
        except Study.DoesNotExist:
            return Response({"error": "Study not found"}, status=404)

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'success': True})
