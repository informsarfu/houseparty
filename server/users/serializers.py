from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

class RegisterSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)


