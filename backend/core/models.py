from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
import secrets
import os

User = get_user_model()

# Create your models here.


class Directory(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE,
                               null=True, blank=True, related_name='subdirectories')

    def __str__(self):
        return self.name


class File(models.Model):

    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


class Image(File):
    related_name = "images"
    directory = models.ForeignKey(
        Directory, on_delete=models.CASCADE, related_name=related_name)
    path = models.ImageField(upload_to='image-files')


class Audio(File):
    related_name = "audios"
    directory = models.ForeignKey(
        Directory, on_delete=models.CASCADE, related_name=related_name)
    path = models.FileField(upload_to='audio-files')


class Other(File):
    related_name = "others"
    directory = models.ForeignKey(
        Directory, on_delete=models.CASCADE, related_name=related_name)
    path = models.FileField(upload_to='other-files')


class Room(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=255, null=True, blank=True,)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(null=True, blank=True, upload_to='room-images')
    root_directory = models.OneToOneField(
        Directory, on_delete=models.CASCADE, null=True, blank=True)
    room_id = models.CharField(
        max_length=4, editable=False, null=True, blank=True)
    max_players = models.IntegerField(
        default=-1, validators=[MinValueValidator(-1)])
    is_private = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    password = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.name}:{self.room_id}"

    def save(self, *args, **kwargs):
        if not self.room_id:
            # Generate a unique 6-character ID
            self.room_id = secrets.token_hex(2).upper()

        # Check if the combination of name+id already exists
        while Room.objects.exclude(pk=self.pk).filter(name=self.name, room_id=self.room_id).exists():
            # Regenerate the id until it is unique for this name
            self.room_id = secrets.token_hex(2).upper()

        super(Room, self).save(*args, **kwargs)


class Canvas(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    active_page = models.OneToOneField(
        'Page', on_delete=models.CASCADE, related_name='active_for', null=True, blank=True)
    room = models.OneToOneField(
        Room, on_delete=models.CASCADE, related_name='canvas')

    def __str__(self):
        return f"{self.room.name}'s canvas"


class Page(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    canvas = models.ForeignKey(
        Canvas, on_delete=models.CASCADE, related_name='pages')
    lines = models.JSONField(blank=True, null=True, default=list)

    def __str__(self):
        return self.name
    
    def add_line(self, line):
        self.lines.append(line)


class Player(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='players')
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name='players')
    is_gm = models.BooleanField(default=False)
    game_mode_choices = [
        ('p', 'Playing'),
        ('s', 'Spectator'),
    ]
    game_mode = models.CharField(
        choices=game_mode_choices,
        max_length=1,
        default='spectator',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'room')

    def __str__(self):
        return '%s (%s)' % (self.user, self.room)


class Chat(models.Model):
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name='chat')


class Message(models.Model):
    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    message = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    written_as = models.CharField(max_length=50, null=True, blank=True)


class CharacterTemplate(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name='templates')

    def _str_(self):
        return self.name


class CharacterField(models.Model):
    character_template = models.ForeignKey(
        CharacterTemplate, on_delete=models.CASCADE, related_name='%(class)s_fields')

    type = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    label = models.CharField(max_length=50)
    placeholder = models.CharField(max_length=50, null=True, blank=True)
    disabled = models.BooleanField(default=False)
    default = models.CharField(max_length=50, null=True, blank=True)
    required = models.BooleanField(default=False)

    def _str_(self):
        return self.name


class Character(models.Model):
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name='characters')
    name = models.CharField(max_length=255)
    data = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class RoomTicket(models.Model):
    title = models.CharField(max_length=50)
    message = models.TextField()
    
    petition_time = models.DateTimeField(auto_now_add=True)
    response_time = models.DateTimeField(null=True, blank=True)
    
    Room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='tickets')
    gamemode = models.CharField(max_length=1, choices=Player.game_mode_choices)
    
    state = models.CharField(max_length=1, choices=[('p', 'Pending'), ('a', 'Accepted'), ('r', 'Rejected')], default='p')
    
    dest_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets_dest')
    origin_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets_origin')
    
    type = models.CharField(max_length=1, choices=[('r', 'Request'), ('i', 'invitation')], default='r')
