from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RoomSerializer, RoomFilesSerializer, UserSerializer
from .models import Room, RoomFiles
from django.contrib.auth.models import User
from rest_framework.response import Response

# View all rooms of user, create room
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def rooms(request):
    if request.method == 'GET':
        all_rooms = Room.objects.filter(users=request.user) | Room.objects.filter(host=request.user)
        serializer = RoomSerializer(all_rooms, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        room_name = request.data.get('name')
        new_room = Room.objects.create(name=room_name, host=request.user)
        new_room.users.add(request.user)
        serializer = RoomSerializer(new_room)
        return Response(serializer.data)

# Delete room, get room details
@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def room(request, room_code):
    if request.method == 'GET':
        if not Room.objects.filter(room_code=room_code).exists():
            return Response({"error": "Room not found."}, status=404)
        
        room_info = Room.objects.get(room_code=room_code)
        serializer = RoomSerializer(room_info)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        room = Room.objects.get(room_code = room_code)
        if not room:
            return Response({"error": "Room not found."}, status=404)
        if room.host != request.user:
            return Response({"error": "Only the host can delete the room."}, status=403)
        room.delete()
        return Response({"message": "Room deleted successfully."}, status=200)
    

# Join room, Leave room
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def room_access(request, room_code):
    if request.method == 'POST':
        try:
            room = Room.objects.get(room_code=room_code)
        except Room.DoesNotExist:
            return Response({"error": "Room not found."}, status=404)

        
        room = Room.objects.get(room_code=room_code)
        if request.user in room.users.all():
            return Response({"message": "Already a member of the room."}, status=200)
        
        room.users.add(request.user)
        return Response({"message": "Joined the room successfully."}, status=200)
    
    if request.method == 'DELETE':
        try:
            room = Room.objects.get(room_code=room_code)
        except Room.DoesNotExist:
            return Response({"error": "Room not found."}, status=404)
        
        room = Room.objects.get(room_code=room_code)
        if request.user not in room.users.all():
            return Response({"error": "Not a member of the room."}, status=403)
        room.users.remove(request.user)
        return Response({"message": "Left the room successfully."}, status=200)




