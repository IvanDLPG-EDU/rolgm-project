from django.shortcuts import get_object_or_404

from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework import filters, status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import RoomSerializer, DirectorySerializer, DetailedRoomSerializer, PlayerSerializer
from .models import Room, Player

from django.db.models import Q

class RoomListAPIView(ListAPIView):
    authentication_classes = []
    permission_classes = []

    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.all()


class DetailedRoomAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, room_name, room_id):
        room = get_object_or_404(Room, name=room_name, room_id=room_id)
        serializer = DetailedRoomSerializer(room)
        return Response(serializer.data)


class RoomSearchView(ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'room_id']
    ordering_fields = ['name', 'room_id']
    queryset = Room.objects.all()


class RoomDirectoryAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, room_name, room_id):
        room = get_object_or_404(Room, name=room_name, room_id=room_id)
        root_directory = room.root_directory
        if root_directory is None:
            return Response({'message': 'No root directory found for this room.'}, status=status.HTTP_404_NOT_FOUND)
        root_serialized = DirectorySerializer(root_directory).data
        return Response({'root_directory': root_serialized}, status=status.HTTP_200_OK)


class GetPlayersAndCharactersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_name, room_id):
        room = get_object_or_404(Room, name=room_name, room_id=room_id)
        players = Player.objects.filter(room=room, user=request.user)
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

class CreateRoomView(CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        owner = request.user
        name = request.data.get('name')
        description = request.data.get('description')
        image = request.data.get('image')
        max_players = request.data.get('max_players')
        is_private = request.data.get('is_private')
        password = request.data.get('password')

        room = Room.objects.create(
            owner=owner,
            name=name,
            description=description,
            image=image,
            max_players=max_players,
            is_private=is_private,
            password=password
        )

        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

