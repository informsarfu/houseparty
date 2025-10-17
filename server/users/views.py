from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

#Register new User
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and email are required.'}, status=400)

    if password and len(password) < 7:
        return Response({'error': 'Password must be at least 7 characters long.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username is already taken.'}, status=400)
    
    user = User.objects.create_user(username=username, password=password)
    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'User registered successfully!',
        'refresh': str(refresh),
        'access': str(refresh.access_token),  
    }, status=status.HTTP_201_CREATED)

    