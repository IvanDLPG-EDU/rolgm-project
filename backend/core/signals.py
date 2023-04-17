from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Room, Directory

@receiver(pre_save, sender=Room)
def create_room_directory(sender, instance, **kwargs):
    if not instance.pk:
        # If the instance is being created (not updated)
        directory = Directory.objects.create(name=instance.name + '@root')
        instance.root_directory = directory

@receiver(pre_save, sender=Directory)
def set_directory_name(sender, instance, **kwargs):
    if not instance.pk:  # Solo si es una nueva instancia
        parent_name = instance.parent.name if instance.parent else ""
        instance.name = f"{parent_name}{instance.name}/"