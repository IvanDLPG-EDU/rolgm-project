from django.shortcuts import render, get_object_or_404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.decorators import api_view
# from allauth.account.models import EmailConfirmationHMAC

from django.contrib.auth import authenticate
from .serializers import RegistrationSerializer, LoginSerializer, UserSerializerToken
from rest_framework.exceptions import ValidationError

# Create your views here.

class RegistrationView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # user = serializer.save(request)
            # # email_confirmation = EmailConfirmationHMAC(user)
            # # email_confirmation.send()
            # return Response(serializer.data, status=status.HTTP_201_CREATED)
            print("Hello XD")
            
        error = None
            
        if 'email' in serializer.errors and 'username' in serializer.errors:
            error = {'errors': {
                'email': ["user with this email already exists."],
                'username': ["user with this username already exists."]
            }}
        elif 'username' in serializer.errors:
            error = {'errors': {'username': ["user with this username already exists."]}}
        elif 'email' in serializer.errors:
            error = {'errors': {'email': ["user with this email already exists."]}}

                
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthenticationView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                serializer = UserSerializerToken(user)
                return Response(serializer.data)
            else:
                json_data = {
                    'errors': {'errors':{'password': ['invalid credentials'],'username': ['invalid credentials']}},
                    'data': None,
                    'status': 'error',
                }
             
                return Response(json_data['errors'], status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)