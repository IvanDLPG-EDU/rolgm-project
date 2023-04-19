from rest_framework import serializers
from .models import Room, Player, Image, Audio, Other, Directory

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('user', 'is_gm', 'game_mode')

class RoomSerializer(serializers.ModelSerializer):
    player_count = serializers.SerializerMethodField()
    spectator_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ('id', 'owner', 'name', 'created_at', 'player_count', 'spectator_count')

    def get_player_count(self, instance):
        return instance.players.filter(game_mode='p').count()

    def get_spectator_count(self, instance):
        return instance.players.filter(game_mode='s').count()
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['name'] = f"{instance.name}#{instance.room_id}"
        return representation
    
class FileSerializer(serializers.ModelSerializer):
    path = serializers.SerializerMethodField()

    class Meta:
        abstract = True
        fields = ('id', 'name', 'created_at', 'path')

    def get_path(self, obj):
        if obj.path:
            return obj.path.path
        return None

class ImageSerializer(FileSerializer):
    class Meta(FileSerializer.Meta):
        model = Image

class AudioSerializer(FileSerializer):
    class Meta(FileSerializer.Meta):
        model = Audio

class OtherSerializer(FileSerializer):
    class Meta(FileSerializer.Meta):
        model = Other



class DirectorySerializer(serializers.ModelSerializer):
    subdirectories = serializers.SerializerMethodField()
    images = ImageSerializer(many=True, read_only=True)
    audios = AudioSerializer(many=True, read_only=True)
    others = OtherSerializer(many=True, read_only=True)

    class Meta:
        model = Directory
        fields = ('id', 'name', 'created_at', 'subdirectories', 'images', 'audios', 'others')

    def get_subdirectories(self, obj):
        serializer = self.__class__(obj.subdirectories.all(), many=True, context=self.context)
        return serializer.data
    
class DetailedRoomSerializer(RoomSerializer):
    root_directory = DirectorySerializer(read_only=True)
    players = PlayerSerializer(many=True, read_only=True)

    class Meta(RoomSerializer.Meta):
        fields = RoomSerializer.Meta.fields + ('players','root_directory')