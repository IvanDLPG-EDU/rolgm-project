from django.urls import re_path

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from core import consumers

websocket_urlpatterns = [
    re_path(
        r'ws/room/(?P<room_name>\w+)/(?P<room_id>[A-Z\d]+)/$', consumers.RoomConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
