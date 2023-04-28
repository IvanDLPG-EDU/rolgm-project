import django, os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rolgm.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.layers import get_channel_layer
from .routing import websocket_urlpatterns


application = get_asgi_application()

# Agregar el middleware de Channels para la autenticación de WebSocket
# Nota: se recomienda agregar esto a todas las aplicaciones, no solo a la aplicación de chat
application = AuthMiddlewareStack(application)

# Configurar el enrutador de protocolo para enrutar las conexiones WebSocket a la aplicación de chat
application = ProtocolTypeRouter({
    "http": application,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})

# Configurar la capa de canales para la aplicación de chat
channel_layer = get_channel_layer()