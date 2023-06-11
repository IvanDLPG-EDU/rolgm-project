from django.shortcuts import get_object_or_404

from django.http import JsonResponse
from pusher import Pusher
from django.views import View
from django.conf import settings

from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
from rest_framework import filters, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import MessageSerializer, CharacterSerializer, RoomSerializer, DirectorySerializer, ChatSerializer, PlayerSerializer, RoomTicketSerializer
from .models import Room, Player, Character, Message,RoomTicket

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json

from .services import create_mensaje, get_character, get_active_page

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        
        # Verifica si el objeto es una instancia de Room o Character.
        if isinstance(obj, Room):
            return obj.owner == request.user
        elif isinstance(obj, Character):
            return obj.player.user == request.user

        return False

pusher_app_id=settings.PUSHER_APP_ID,
pusher_key=settings.PUSHER_KEY,
pusher_secret=settings.PUSHER_SECRET,
pusher_cluster=settings.PUSHER_CLUSTER,

pusher = None

if pusher_app_id[0] and pusher_key[0] and pusher_secret[0] and pusher_cluster[0]:
    pusher = Pusher(
    app_id=pusher_app_id[0],
    key=pusher_key[0],
    secret=pusher_secret[0],
    cluster=pusher_cluster[0],
)

@csrf_exempt 
def pusher_auth_view(request):

    # pusher.set_option('allowed_origins', ['http://172.18.0.3:5173',])

    if request.method == 'POST':
        channel_name = request.POST.get('channel_name')
        socket_id = request.POST.get('socket_id')

        auth = pusher.authenticate(
            channel=channel_name,
            socket_id=socket_id
        )

        # auth = pusher.authenticate(
        #     channel='private-room-1',
        #     socket_id='150579.11173180'
        # )

        return JsonResponse(auth)

    # En caso de que se reciba una solicitud de otro método que no sea POST
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def pusher_webhook(request):
    def do_message(room_id, message_data):
        chat = Room.objects.get(id=room_id).chat.get()
        message = message_data['message']
        written_as = message_data['written_as']
        user_id = message_data['user_id']
        
        mensaje = Message(
            chat=chat,
            user_id=user_id,
            message=message,
            written_as=written_as
        )
        mensaje.save()
        
        serializer = MessageSerializer(mensaje)
        
        return serializer.data

    def do_character(character_data):
        player = Player.objects.get(id=character_data['player'])
        
        try:
            character = Character.objects.get(player=player, name=character_data['name'])
        except Character.DoesNotExist:
            character = None
        
        serializer = CharacterSerializer(character)
        
        return serializer.data

    if request.method == 'POST':
        data = json.loads(request.body)
        events = data.get('events', [])
        
        for event in events:
            channel = event.get('channel')
            event_name = event.get('event')
            event_data = json.loads(event.get('data'))
            
            room_id = channel.replace('private-room-', '')
            event_payload_data = event_data['data']['payload']
            
            if event_name == 'client-add_chat_message':
                data = do_message(room_id, event_payload_data)   
                pusher.trigger(channel, 'message', data)
            elif event_name == 'client-add_character':    
                data = do_character(event_payload_data)   
                pusher.trigger(channel, 'character', data)
            else:
                data = {"date": "2023-05-28T12:57:20.190166Z",
                        "id": 1,
                        "message": f'Evento {event_name} recibido correctamente',
                        "user": 1,
                        "written_as": "admin"
                        }
                pusher.trigger('private-room-3', 'message', data)
            
        return JsonResponse({'message': 'Datos recibidos correctamente'})
    
    return JsonResponse({'message': 'Método no permitido'}, status=405)



    # Maneja otros métodos HTTP si es necesario
    # return JsonResponse({'message': 'Método no permitido'}, status=405)
    

class RoomListAPIView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.all()

class OwnRoomListAPIView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer

    def get_queryset(self):
        user = self.request.user
        return Room.objects.filter(players__user=user)


class RoomSearchView(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'room_id']
    ordering_fields = ['name', 'room_id']
    queryset = Room.objects.all()

class DetailedRoomAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        room = get_object_or_404(Room, id=id)
        serializer = RoomSerializer(room)
        return Response(serializer.data)

class RoomChatAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        room = get_object_or_404(Room, id=id)
        chat = room.chat.first()
        serializer = ChatSerializer(chat)
        return Response(serializer.data)

class RoomDirectoryAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

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
    allowed_methods = ['POST']
    
    def post(self, request, *args, **kwargs):
        player_id = request.data['player_id']
        name = request.data['name']
        
        player = get_object_or_404(Player, id=player_id)

        # Validar si el personaje ya existe para ese jugador
        if Character.objects.filter(player=player, name=name).exists():
            return Response({'errors':{'name': ['El personaje ya existe para este jugador',]}}, status=status.HTTP_400_BAD_REQUEST)

        # Crear el personaje si no existe previamente
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

class PlayerCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    allowed_methods = ['POST']
    
    def post(self, request, id):

        room = get_object_or_404(Room, id=id)
        
        # Validar si el personaje ya existe para ese jugador
        if Player.objects.filter(user=request.user, room=room).exists():
            return Response({'errors':{'user': ['El usuario ya existe en esta sala',]}})

        # Crear el player si no existe previamente
        
        player = Player.objects.create(
            user=request.user,
            room=room,
            is_gm=False,
            game_mode='p',
        )

        serializer = PlayerSerializer(player)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    

class DeleteRoomView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    allowed_methods = ['POST']
    
    def post(self, request, id):
        try:
            room = Room.objects.get(id=id)
        except Room.DoesNotExist:
            return Response({'detail': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, room)

        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DeleteCharacterView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    allowed_methods = ['POST']

    def post(self, request, id):
        try:
            character = Character.objects.get(id=id)
        except Character.DoesNotExist:
            return Response({'detail': 'Character not found.'}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, character)

        character.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class UserTicketsView(ListAPIView):
    serializer_class = RoomTicketSerializer

    def get_queryset(self):
        user = self.request.user
        return RoomTicket.objects.filter(Q(dest_user=user) | Q(origin_user=user))


class CreateTicketView(CreateAPIView):
    serializer_class = RoomTicketSerializer

class DeleteTicketView(DestroyAPIView):
    serializer_class = RoomTicketSerializer
    queryset = RoomTicket.objects.all()