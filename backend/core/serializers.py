from rest_framework import serializers
from .models import Room, Player, Image, Audio, Other, Directory, Chat, Message, Player, Character
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(many=True, read_only=True)

    class Meta:
        model = Player
        fields = ['id', 'user', 'room', 'is_gm',
                  'game_mode', 'created_at', 'characters']


class RoomSerializer(serializers.ModelSerializer):
    player_count = serializers.SerializerMethodField()
    spectator_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ('id', 'owner', 'name', 'description', 'image', 'max_players', 'room_id', 'created_at', 'max_players', 'is_private',
                  'player_count', 'spectator_count')

    def get_player_count(self, instance):
        return instance.players.filter(game_mode='p').count()

    def get_spectator_count(self, instance):
        return instance.players.filter(game_mode='s').count()


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
        fields = ('id', 'name', 'created_at', 'subdirectories',
                  'images', 'audios', 'others')

    def get_subdirectories(self, obj):
        serializer = self.__class__(
            obj.subdirectories.all(), many=True, context=self.context)
        return serializer.data


class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'user', 'message', 'date', 'written_as')


class ChatSerializer(serializers.ModelSerializer):
    mensajes = MensajeSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'messages')


class DetailedRoomSerializer(RoomSerializer):
    root_directory = DirectorySerializer(read_only=True)
    players = PlayerSerializer(many=True, read_only=True)
    messages = serializers.SerializerMethodField()

    class Meta(RoomSerializer.Meta):
        fields = RoomSerializer.Meta.fields + \
            ('players', 'root_directory', 'messages')

    def get_messages(self, obj):
        chat = Chat.objects.filter(room=obj).first()
        messages = chat.messages.all()
        return MensajeSerializer(messages, many=True).data
