from django.db import models
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

    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    root_directory = models.OneToOneField(Directory, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name