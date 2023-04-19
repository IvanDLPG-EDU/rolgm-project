from django.urls import path
from .views import RoomListAPIView, RoomSearchView,RoomDirectoryAPIView, DetailedRoomAPIView

urlpatterns = [
    path('rooms/', RoomListAPIView.as_view(), name='room-list'),
    path('rooms/search/', RoomSearchView.as_view(), name='room_search'),
    path('room/<int:room_id>/', DetailedRoomAPIView.as_view(), name='detailed-room'),
    path('room/<int:room_id>/directory/', RoomDirectoryAPIView.as_view(), name='room_directory'),
]