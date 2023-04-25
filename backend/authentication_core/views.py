from django.shortcuts import render, get_object_or_404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.decorators import api_view
from allauth.account.models import EmailConfirmationHMAC

from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import RegistrationSerializer

# Create your views here.

@api_view(['POST'])
def registration_view(request):
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save(request)
        email_confirmation = EmailConfirmationHMAC(user)
        email_confirmation.send()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthenticationView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print(username,password)
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
