from django.shortcuts import render, get_object_or_404

from rest_framework.generics import ListAPIView
from rest_framework import filters, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RoomSerializer, DirectorySerializer,DetailedRoomSerializer
from .models import Room

# Create your views here.

class RoomListAPIView(ListAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.all()
    
class DetailedRoomAPIView(APIView):

    def get(self, request, room_id):
        room = get_object_or_404(Room, id=room_id)
        serializer = DetailedRoomSerializer(room)
        return Response(serializer.data)

class RoomSearchView(ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'owner__username']

class RoomDirectoryAPIView(APIView):
    def get(self, request, room_id):
        room = get_object_or_404(Room, id=room_id)
        root_directory = room.root_directory
        if root_directory is None:
            return Response({'message': 'No root directory found for this room.'}, status=status.HTTP_404_NOT_FOUND)
        root_serialized = DirectorySerializer(root_directory).data
        return Response({'root_directory': root_serialized}, status=status.HTTP_200_OK)