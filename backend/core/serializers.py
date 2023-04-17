from rest_framework import serializers
from .models import Room, Player

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('user', 'is_gm', 'game_mode')

class RoomSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ('id', 'owner', 'name', 'created_at', 'players')