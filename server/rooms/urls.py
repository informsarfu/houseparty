from django.urls import path
from . import views

urlpatterns = [
    path('', views.rooms, name='rooms'),
    path('<str:room_code>/', views.room, name='room'),
    path('<str:room_code>/access/', views.room_access, name='room_access'),
    path('<str:room_code>/files/', views.files, name='files'),
]


#view all rooms
#create a room
#delete a room
#join a room
#leave a room


#get room details
#upload file to room


