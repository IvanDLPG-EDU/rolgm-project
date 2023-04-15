from django.contrib import admin
from .models import Directory, Image, Audio, Other

# Register your models here.

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