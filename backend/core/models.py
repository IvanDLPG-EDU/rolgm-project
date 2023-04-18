from django.db import models
from django.contrib.auth.models import User
import os 

# Create your models here.

class Directory(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subdirectories')

    def __str__(self):
        return self.name

class File(models.Model):

    def get_upload_path(self, filename):
        pass

    related_name = None

    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    directory = models.ForeignKey(Directory, on_delete=models.CASCADE, related_name=related_name)

    def __str__(self):
        return self.name

    class Meta:
        abstract = True

class Image(File):
    related_name = "images"

    path = models.ImageField(upload_to='media/image-files')

class Audio(File):
    related_name = "audios"

    path = models.FileField(upload_to='media/audio-files')

class Other(File):
    related_name = "others"

    path = models.FileField(upload_to='media/other-files')
    
class Room(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    root_directory = models.OneToOneField(Directory, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name
    
class Canvas(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    active_page = models.OneToOneField('Page', on_delete=models.CASCADE, related_name='active_for', null=True, blank=True)
    room = models.OneToOneField(Room, on_delete=models.CASCADE, related_name='canvas')

    def __str__(self):
        return f"{self.room.name}'s canvas"

class Page(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    canvas = models.ForeignKey(Canvas, on_delete=models.CASCADE, related_name='pages')
    data = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.name

class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='players')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='players')
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
        return self.user.username