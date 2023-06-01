import json
from channels.generic.websocket import AsyncWebsocketConsumer

# Importar modelos
from .services import create_mensaje, get_character, get_active_page
from .serializers import MessageSerializer, CharacterSerializer

import pusher
from django.conf import settings

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = 'room_%s' % (self.room_id)

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

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json['data']

        type = data['type']
        payload = data['payload']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': type,
                'payload': payload
            }
        )

    # Receive message from room group
    async def add_chat_message(self, event):

        # Create mensaje en la base de datos
        mensaje = await create_mensaje(
            room_id=self.room_id,
            data=event['payload'],
        )

        # Serializar el mensaje creado en la base de datos
        serializer = MessageSerializer(mensaje)

        # Enviar el mensaje serializado de vuelta al cliente a través del WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'text_data': serializer.data
        }))

    async def add_character(self, event):

        # get personaje en la base de datos
        character = await get_character(
            data=event['payload'],
        )

        # Serializar el personaje creado en la base de datos
        serializer = CharacterSerializer(character)

        # Enviar el personaje serializado de vuelta al cliente a través del WebSocket
        await self.send(text_data=json.dumps({
            'type': 'character',
            'text_data': serializer.data
        }))

    async def add_page_line(self, event):
        line = event['payload']['line']
        canvas_id = event['payload']['canvas_id']

        active_page = await get_active_page(
            canvas_id,
        )

        active_page.lines.append(line)
        active_page.save()

        # Enviar la nueva linea de vuelta al cliente a través del WebSocket
        await self.send(text_data=json.dumps({
            'type': 'canvas_line',
            'text_data': line
        }))
