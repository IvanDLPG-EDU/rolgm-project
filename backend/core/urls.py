from django.urls import path, re_path
from .views import RoomListAPIView, RoomSearchView,RoomDirectoryAPIView, DetailedRoomAPIView

urlpatterns = [
    path('rooms/', RoomListAPIView.as_view(), name='room-list'),
    path('rooms/search/', RoomSearchView.as_view(), name='room_search'),
    re_path(r'^room/(?P<room_name>[\w\s]+)/(?P<room_id>[A-Z\d]+)$', DetailedRoomAPIView.as_view(), name='detailed-room'),
    re_path(r'^room/(?P<room_name>[\w\s]+)/(?P<room_id>[A-Z\d]+)/directory/$', RoomDirectoryAPIView.as_view(), name='room_directory'),

]