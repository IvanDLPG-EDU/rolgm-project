from django.contrib import admin
from django import forms
from .models import Directory, Image, Audio, Other, Room, Player, Canvas, Page, Chat, Message, Character

# Register your models here.


class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        exclude = ('root_directory',)


@admin.register(Directory)
class DirectoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'parent')
    list_filter = ('created_at',)
    search_fields = ('name',)


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'directory')
    list_filter = ('created_at', 'directory')
    search_fields = ('name', 'directory__name')


@admin.register(Audio)
class AudioAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'directory')
    list_filter = ('created_at', 'directory')
    search_fields = ('name', 'directory__name')


@admin.register(Other)
class OtherAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'directory')
    list_filter = ('created_at', 'directory')
    search_fields = ('name', 'directory__name')


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    form = RoomForm
    list_display = ('room_name', 'owner', 'created_at', 'root_directory')
    search_fields = ('name',)
    ordering = ('-created_at',)

    def room_name(self, obj):
        return f"{obj.name}:{obj.room_id}"


@admin.register(Canvas)
class CanvasAdmin(admin.ModelAdmin):
    list_display = ('room', 'created_at', 'active_page')
    search_fields = ('room__name',)
    ordering = ('-created_at',)


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('name', 'canvas', 'created_at')
    search_fields = ('name', 'canvas__room__name')
    ordering = ('-created_at',)


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'game_mode', 'is_gm', 'created_at')
    list_filter = ('is_gm', 'game_mode', 'created_at')
    search_fields = ('user__username', 'room__name')
    ordering = ('-created_at',)


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    pass


@admin.register(Message)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ('message', 'user', 'date')


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ('name', 'player')
