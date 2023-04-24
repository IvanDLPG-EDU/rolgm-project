import json
from channels.generic.websocket import AsyncWebsocketConsumer

# Importar modelos
from .services import create_mensaje

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = 'room_%s_%s' % (self.room_name, self.room_id)
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
        print("\n\n\n==============\n\n\n")
        print(text_data_json)
        print("\n\n\n==============\n\n\n")
        data = text_data_json['data']
        message = data['message']
        written_as = data['written_as']

        # Send message to room group
        await self.channel_layer.group_send(
        self.room_group_name,
        {
            'type': 'chat_message',
            'message': message,
            'written_as': written_as,
        }
    )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        written_as = event['written_as']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'written_as': written_as
        }))

        # Create mensaje en la base de datos
        await create_mensaje(
            room_name=self.room_name,
            room_id=self.room_id,
            user_id=None,
            message=message,
            written_as=written_as,
        )