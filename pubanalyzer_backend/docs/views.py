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

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # def create(self, request, *args, **kwargs):   Uncomment and replace local host with deployed IP when deploying
    #     origin = request.headers.get("Origin")
    #     if origin != "http://localhost:3000":
    #         return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    #     return super().create(request, *args, **kwargs)
    
@method_decorator(csrf_exempt, name='dispatch')
class SessionLoginView(APIView):
    def post(self, request):
        # origin = request.headers.get("Origin")
        # if origin != "http://localhost:3000":
        #         return Response({"detail": "Forbidden"}, status=403)
        
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
class LogoutView(APIView):
    def post(self, request):
        # origin = request.headers.get("Origin")
        # if origin != "http://localhost:3000":
        #         return Response({"detail": "Forbidden"}, status=403)
        
        logout(request)
        return Response({"message": "Logged out successfully"})