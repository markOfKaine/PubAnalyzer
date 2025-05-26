from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework import generics
from rest_framework import serializers
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import UserStudies

class OriginCheck:
    allowed_origin = "http://localhost:3000" #change to frontend URL in production

    def dispatch(self, request, *args, **kwargs):
        # origin = request.headers.get("Origin") #Uncomment in production
        # if origin != self.allowed_origin:
        #     return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return super().dispatch(request, *args, **kwargs)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(OriginCheck, generics.CreateAPIView):
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
    
@method_decorator(csrf_exempt, name='dispatch')
class UserAuthView(OriginCheck, APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'message': 'Authenticated',
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
            })
        return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class SessionLoginView(OriginCheck, APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=400)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  # creates a session
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

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(OriginCheck, APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})