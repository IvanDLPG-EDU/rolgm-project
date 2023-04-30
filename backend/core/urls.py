from django.urls import path, re_path
from .views import RoomListAPIView, RoomSearchView,CreateRoomView ,RoomDirectoryAPIView, DetailedRoomAPIView, GetPlayersAndCharactersAPIView

urlpatterns = [
    path('rooms/', RoomListAPIView.as_view(), name='room_list'),
    path('rooms/search/', RoomSearchView.as_view(), name='room_search'),
    path('rooms/create/', CreateRoomView.as_view(), name='room_create'),
    re_path(r'^room/(?P<room_name>[\w\s]+)/(?P<room_id>[A-Z\d]+)$',
            DetailedRoomAPIView.as_view(), name='room_detailed'),
    re_path(r'^room/(?P<room_name>[\w\s]+)/(?P<room_id>[A-Z\d]+)/directory/$',
            RoomDirectoryAPIView.as_view(), name='room_directory'),
    re_path(r'^room/(?P<room_name>[\w\s]+)/(?P<room_id>[A-Z\d]+)/my-characters/$',
            GetPlayersAndCharactersAPIView.as_view(), name='user_characters')

]
