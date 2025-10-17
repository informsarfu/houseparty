from rest_framework import serializers
from .models import Room, RoomFiles
from django.contrib.auth.models import User

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'host', 'room_code', 'users', 'created_at']

class RoomFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomFiles
        fields = ['id', 'room', 'file', 'uploaded_by', 'uploaded_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']