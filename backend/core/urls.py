from django.urls import path, re_path
from .views import pusher_auth_view, pusher_webhook, RoomListAPIView, OwnRoomListAPIView,PlayerCharactersAPIView,CharacterCreateView, RoomSearchView,CreateRoomView ,RoomDirectoryAPIView, RoomChatAPIView, DetailedRoomAPIView, UserPlayerAPIView

urlpatterns = [
    path('rooms/', RoomListAPIView.as_view(), name='room_list'),
    path('own-rooms/', OwnRoomListAPIView.as_view(), name='own_room_list'),
    path('rooms/search/', RoomSearchView.as_view(), name='room_search'),
    path('rooms/create/', CreateRoomView.as_view(), name='room_create'),
    path('character/create/', CharacterCreateView.as_view(), name='character_create'),
    re_path(r'^player/(?P<id>\d+)/characters/$',
            PlayerCharactersAPIView.as_view(), name='player_characters'),
    re_path(r'^room/(?P<id>\d+)/$',
            DetailedRoomAPIView.as_view(), name='room_detailed'),
    re_path(r'^room/(?P<id>\d+)/directories/$',
            RoomDirectoryAPIView.as_view(), name='room_directories'),
    re_path(r'^room/(?P<id>\d+)/my-player/$',
            UserPlayerAPIView.as_view(), name='user_player'),
    re_path(r'^room/(?P<id>\d+)/chat/$',
            RoomChatAPIView.as_view(), name='room_chat'),
    
    path('pusher/auth/', pusher_auth_view, name='pusher_auth'),
    path('pusher/webhook/', pusher_webhook, name='pusher_webhook'),


]
