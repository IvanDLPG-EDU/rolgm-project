from channels.db import database_sync_to_async
from .models import Room, Message

@database_sync_to_async
def create_mensaje(room_name, room_id, user_id, message,written_as):
    # obtener el chat de la habitación
    chat = Room.objects.get(name=room_name, room_id=room_id).chat.get()

    # crear el mensaje en el chat
    mensaje = Message(
        chat=chat,
        user_id=user_id,
        message=message,
        written_as=written_as
    )
    mensaje.save()