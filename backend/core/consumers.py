import json
from channels.generic.websocket import AsyncWebsocketConsumer

# Importar modelos
from .services import create_mensaje
from .serializers import MessageSerializer


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = 'room_%s' % (self.room_id)
        print(self.room_group_name)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json['data']
        message = data['message']
        written_as = data['written_as']
        user_id = data['user_id']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'written_as': written_as,
                'user_id': user_id,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):

        # Create mensaje en la base de datos
        mensaje = await create_mensaje(
            room_id=self.room_id,
            data=event,
        )

        # Serializar el mensaje creado en la base de datos
        serializer = MessageSerializer(mensaje)

        # Enviar el mensaje serializado de vuelta al cliente a través del WebSocket
        await self.send(text_data=json.dumps(serializer.data))