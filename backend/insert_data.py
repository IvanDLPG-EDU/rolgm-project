import django, os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rolgm.settings')
django.setup()


# Crear un objeto Room
from core.models import Room
from django.contrib.auth import get_user_model

User = get_user_model()

owner, created = User.objects.get_or_create(
    username='testuser',
    email='testuser@example.com',
    defaults={'password': 'testpassword'}
)

if not created:
    # El usuario ya existía
    print('El usuario ya existe')

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
