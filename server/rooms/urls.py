from django.urls import path
from .views import RoomListView, RoomView
from . import views

urlpatterns = [
    path('', RoomListView.as_view(), name='all_rooms'),
    path('<str:room_code>', RoomView.as_view(), name='room'),
    path('<str:room_code>/access/', views.room_access, name='room_access'),
    path('<str:room_code>/files/', views.files, name='files'),
]



