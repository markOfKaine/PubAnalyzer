import json
import logging
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import User

class AddUserView(View):
    def post(self, request):
        try:
            body = json.loads(request.body)
            email = body.get('email')
            password = body.get('password') ##could be hashed by front-end already

            if not email or not password:
                logging.warning("Missing email or password in request.")

            user = User.objects.create(email=email, password=password)
            logging.info(f"User created successfully with ID {user.userID}.")

            return JsonResponse({'message': 'User created successfully', 'userID': user.userID}, status=201)

        except Exception as e:
            logging.error(f"Error creating user: {e}")