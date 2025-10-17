from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    name = models.CharField(max_length=20)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    room_code = models.CharField(max_length=8, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class RoomFiles(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='room_files/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)