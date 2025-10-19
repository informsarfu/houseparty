from rest_framework.decorators import api_view, permission_classes
from .models import Room, RoomFiles
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RoomSerializer, RoomFilesSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

# View all rooms of user, create room
class RoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        all_rooms = Room.objects.filter(users=request.user)
        serializer = RoomSerializer(all_rooms, many=True)
        return Response(serializer.data)

    def post(self, request):
        room_name = request.data.get('name')
        new_room = Room.objects.create(name=room_name, host=request.user) 
        new_room.users.add(request.user)
        serializer = RoomSerializer(new_room)
        return Response(serializer.data)


# Delete room, get room details
class RoomView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_code):
        if not Room.objects.filter(room_code=room_code).exists():
            return Response({"error": "Room not found."}, status=404)
        
        room_info = Room.objects.get(room_code=room_code)
        serializer = RoomSerializer(room_info)
        return Response(serializer.data)
    
    def delete(self, request, room_code):
        print("request -> ", request)
        print("room-code -> ", room_code)
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
    try:
        room = Room.objects.get(room_code=room_code)
    except Room.DoesNotExist:
        return Response({"error": "Room not found."}, status=404)
    
    serializer = RoomSerializer(room)
    if request.method == 'POST':
        room = Room.objects.get(room_code=room_code)
        if request.user in room.users.all():
            return Response({
                "message": "Already a member of the room.",
                "room": None}, status=200)
        
        room.users.add(request.user)
        return Response({"message": "Joined the room successfully.",
                         "room": serializer.data}, status=200)
    
    if request.method == 'DELETE':
        print("Room-code -> ", room_code )
        room = Room.objects.get(room_code=room_code)
        print(room.users.all())
        if request.user not in room.users.all():
            return Response({"error": "Not a member of the room."}, status=403)
        if request.user == room.host:
            return Response({"error": "You cannot leave the room since you are the host"}, status=403)
        room.users.remove(request.user)
        return Response({"message": "Left the room successfully."}, status=200)


#file upload to room, get files, delete files
@api_view(['POST', 'GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def files(request, room_code):
    try:
        room = Room.objects.get(room_code=room_code)
        print("Room -> ", room)
    except Room.DoesNotExist:
        return Response({"error": "Room not found."}, status=404)
    
    if request.method == 'POST':
        print("File upload request -> ", request.FILES)
        uploaded_file = request.FILES.get('file')
        user = request.user
        print(uploaded_file)

        if not uploaded_file:
            return Response({"error": "No file provided."}, status=400)
        
        if user not in room.users.all():
            return Response({"error": "Not authorized to upload"}, status=401)
        
        room_file = RoomFiles.objects.create(
            room=room,
            file=uploaded_file,
            uploaded_by=user
        )

        serializer = RoomFilesSerializer(room_file)
        return Response(serializer.data, status=201)
    
    if request.method == 'GET':
        if request.user not in room.users.all():
            return Response({"error": "Not authorized to view files"}, status=401)

        room_files = RoomFiles.objects.filter(room=room)
        serializer = RoomFilesSerializer(room_files, many=True)
        return Response(serializer.data)

    if request.method == 'DELETE':
        file_id = request.data.get('file_id')
        print("file id -> ", file_id)
        try:
            room_file = RoomFiles.objects.get(id=file_id, room=room)
        except RoomFiles.DoesNotExist:
            return Response({"error": "File not found."}, status=404)

        if room_file.uploaded_by != request.user and room.host != request.user:
            return Response({"error": "Not authorized to delete this file."}, status=403)
    
        room_file.delete()
        return Response({"message": "file deleted successfully."}, status=200)
