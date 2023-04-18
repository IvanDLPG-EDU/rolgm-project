from django.db.models.signals import pre_save, post_save, pre_delete, post_delete
from django.dispatch import receiver
from .models import Room, Canvas,Page, Directory, Player

@receiver(pre_save, sender=Room)
def create_room(sender, instance, **kwargs):
    if not instance.pk:
        # If the instance is being created (not updated)
        directory = Directory.objects.create(name=instance.name + '@root')
        instance.root_directory = directory

@receiver(post_save, sender=Room)
def create_canvas(sender, instance, created, **kwargs):
    if created:
        Canvas.objects.create(room=instance)


@receiver(post_save, sender=Canvas)
def create_first_page(sender, instance, created, **kwargs):
    if created:
        first_page = Page.objects.create(name="First Page", canvas=instance)
        instance.active_page = first_page
        instance.save()

# @receiver(pre_save, sender=Directory)
# def set_directory_name(sender, instance, **kwargs):
#     if not instance.pk:  # Solo si es una nueva instancia
#         parent_name = instance.parent.name if instance.parent else ""
#         instance.name = f"{parent_name}{instance.name}/"

@receiver(post_save, sender=Room)
def create_player(sender, instance, created, **kwargs):
    if created:
        Player.objects.create(
            user=instance.owner,
            room=instance,
            is_gm=True,
            game_mode='p',
        )

@receiver(pre_delete, sender=Room)
def delete_related_objects(sender, instance, **kwargs):
    directory = instance.root_directory
    instance.root_directory = None
    instance.save()
    if directory:
        directory.delete()

    

@receiver(post_delete, sender=Player)
def delete_room_if_owner(sender, instance, **kwargs):
    room = instance.room
    if room.owner == instance.user:
        room.delete()

