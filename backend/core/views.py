from django.shortcuts import render

from rest_framework.generics import ListAPIView
from .serializers import RoomSerializer
from .models import Room

# Create your views here.

class RoomListAPIView(ListAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.all()