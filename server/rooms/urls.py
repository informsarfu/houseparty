from django.urls import path
from . import views

urlpatterns = [
    path('', views.all_rooms, name='all_rooms'),
    path('create', views.create_room, name='create_room'),
    path('<str:room_code>', views.get_room, name='get_room'),
    path('<str:room_code>/join', views.join_room, name='join_room'),
    path('<str:room_code>/leave', views.leave_room, name='leave_room'),
    path('<str:room_code>/files', views.upload_file, name='upload_file'),
]

