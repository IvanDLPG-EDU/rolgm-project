from django.contrib import admin
from django import forms
from .models import CharacterTemplate, CharacterField, Directory, Image, Audio, Other, Room, Player, Canvas, Page, Chat, Message, Character

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
    list_display = ('owner', 'room_name', 'created_at', 'root_directory', 'max_players_display','is_private' , 'is_active')
    list_filter = ('is_private', 'is_active', 'created_at')
    search_fields = ('name', 'created_at')
    ordering = ('-created_at',)

    def room_name(self, obj):
        return f"{obj.name}:{obj.room_id}"

    def max_players_display(self, obj):
        if obj.max_players == -1:
            return "∞"
        return obj.max_players
    max_players_display.short_description = "Max Players"

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
    
@admin.register(CharacterTemplate)
class CharacterTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'room')

@admin.register(CharacterField)
class CharacterFieldAdmin(admin.ModelAdmin):
    list_display = ('character_template', 'type', 'name', 'label', 'placeholder', 'disabled', 'default', 'required')

