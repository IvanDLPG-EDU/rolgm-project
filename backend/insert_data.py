import django, os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rolgm.settings')
django.setup()


# Crear un objeto Room
from core.models import Room
from django.contrib.auth import get_user_model

User = get_user_model()

# Busca un usuario existente con la dirección de correo electrónico proporcionada
owner = User.objects.filter(email='testuser@example.com').first()

# Si no existe un usuario con esa dirección de correo electrónico, crea uno nuevo
if not owner:
    owner = User.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='testpassword',
    )

room, created = Room.objects.get_or_create(
    owner=owner,
    name='Test_Room',
    description='This is a test room',
    max_players=10,
    is_private=True,
    is_active=True,
    password='testpassword',
)

if not created:
    # El usuario ya existía
    print('La sala ya existe')
