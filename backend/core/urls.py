from django.urls import path
from .views import RoomListAPIView, RoomSearchView

urlpatterns = [
    path('rooms/', RoomListAPIView.as_view(), name='room-list'),
    path('rooms/search/', RoomSearchView.as_view(), name='room_search'),
]