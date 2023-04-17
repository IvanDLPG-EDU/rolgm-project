from django.urls import path
from .views import RoomListAPIView

urlpatterns = [
    path('rooms/', RoomListAPIView.as_view(), name='room-list'),
]