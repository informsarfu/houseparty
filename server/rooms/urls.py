from django.urls import path
from . import views

urlpatterns = [
    path('', views.rooms, name='rooms'),
    path('<str:room_code>/', views.room, name='room'),
]


#view all rooms
#create a room
#delete a room
#join a room
#leave a room


#get room details
#upload file to room


