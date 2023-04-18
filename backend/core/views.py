from django.shortcuts import render

from rest_framework.generics import ListAPIView
from rest_framework import filters
from .serializers import RoomSerializer
from .models import Room

# Create your views here.

class RoomListAPIView(ListAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.all()
    

class RoomSearchView(ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'owner__username']