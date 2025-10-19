from django.db import models
from django.contrib.auth.models import User
import string
import random
from django.db.models.signals import post_delete
from django.dispatch import receiver



def generate_room_code():
    size = 6
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k = size))
    while Room.objects.filter(room_code=code).exists():
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k = size))
    return code


class Room(models.Model):
    name = models.CharField(max_length=20)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    room_code = models.CharField(max_length=8, unique=True, default=generate_room_code)
    users = models.ManyToManyField(User, related_name='rooms', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def delete(self, *args, **kwargs):
        for file_obj in self.files.all():
            file_obj.delete()
        super().delete(*args, **kwargs)
    

class RoomFiles(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='room_files/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def delete(self, *args, **kwargs):
        self.file.delete()
        super().delete(*args, **kwargs)