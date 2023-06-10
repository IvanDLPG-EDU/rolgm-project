from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.conf import settings
from django.urls import reverse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
# from allauth.account.models import EmailConfirmationHMAC

from django.contrib.auth import authenticate
from .serializers import RegistrationSerializer, LoginSerializer, UserSerializerToken
from rest_framework.exceptions import ValidationError

from django.contrib.sites.shortcuts import get_current_site

from rest_framework import generics, authentication, permissions
from .utils import Util

# Create your views here.

class RegistrationView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(request)

            #get token of user=user
            token, _ = Token.objects.get_or_create(user=user)

            token = token.key

            DOMAIN_CLIENT = settings.DOMAIN_CLIENT,
            current_site = DOMAIN_CLIENT[0]
            relativeLink = '/email-verify/'
            absurl= str(current_site)+relativeLink+str(token)

            data = {
                'user': user,
                'absurl': absurl,
                'subject': 'Verify your email',
                'email': user.email
            }

            Util.send_email(data)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
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

class VerifyEmail(generics.GenericAPIView):
    authentication_classes = []  
    permission_classes = []  

    def get_queryset(self):
        return Token.objects.all()  # Reemplaza `Token` con el modelo de token que estás utilizando

    def get(self, request):
        token = request.GET.get('token')
        try:
            token_obj = self.get_queryset().get(key=token)
        except Token.DoesNotExist:
            raise ValidationError('El token no es válido o ha expirado')
        user = token_obj.user
        if user.is_verified:
            return Response({'message': 'El usuario ya está verificado'})
        user.is_verified = True
        user.save()
        return Response({'message': 'Activación exitosa'})

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