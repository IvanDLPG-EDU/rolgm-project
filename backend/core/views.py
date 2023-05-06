from django.shortcuts import get_object_or_404

from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework import filters, status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import CharacterSerializer, RoomSerializer, DirectorySerializer, ChatSerializer, PlayerSerializer
from .models import Room, Player, Character

from django.db.models import Q

class RoomListAPIView(ListAPIView):
    authentication_classes = []
    permission_classes = []

    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.all()

class RoomSearchView(ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'room_id']
    ordering_fields = ['name', 'room_id']
    queryset = Room.objects.all()

class DetailedRoomAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, id):
        room = get_object_or_404(Room, id=id)
        serializer = RoomSerializer(room)
        return Response(serializer.data)

class RoomChatAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, id):
        room = get_object_or_404(Room, id=id)
        chat = room.chat.first()
        serializer = ChatSerializer(chat)
        return Response(serializer.data)

class RoomDirectoryAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, id):
        room = get_object_or_404(Room, id=id)
        root_directory = room.root_directory
        if root_directory is None:
            return Response({'message': 'No root directory found for this room.'}, status=status.HTTP_404_NOT_FOUND)
        root_serialized = DirectorySerializer(root_directory).data
        return Response({'root_directory': root_serialized}, status=status.HTTP_200_OK)


class UserPlayerAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        room = get_object_or_404(Room, id=id)
        player = Player.objects.filter(room=room, user=request.user)
        serializer = PlayerSerializer(player, many=True)
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


class CharacterCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    allowed_methods = ['POST']  # agregar el método POST permitido
    
    def post(self, request, *args, **kwargs):  # cambiar el nombre del método a 'post'
        
        player_id = request.data['player_id']
        name = request.data['name']
        
        player = get_object_or_404(Player, id=player_id)



        character = Character.objects.create(
            player=player,
            name=name,
        )

        serializer = CharacterSerializer(character)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PlayerCharactersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        player = get_object_or_404(Player, id=id)
        characters = player.characters
        serializer = CharacterSerializer(characters, many=True)
        return Response(serializer.data)
