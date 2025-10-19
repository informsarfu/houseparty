import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './MyRooms.css'

export const MyRooms = () => {
  const [loading, setLoading] = useState(false);
  const [allRooms, setAllRooms] = useState<string[]>([]);
  const [user, setUser] = useState({id: null, name: null, username: null});
  const [newRoom, setNewRoom] = useState("");
  const [joinRoom, setJoinRoom] = useState("");
  const navigate = useNavigate();

  const fetchRoomsUrl = 'http://127.0.0.1:8000/api/rooms/'
  const fetchUserInfoUrl = 'http://127.0.0.1:8000/api/auth/userinfo/'
  const fetchJoinRoomUrl = 'http://127.0.0.1:8000/api/rooms/'
  const fetchLogoutUrl = 'http://127.0.0.1:8000/api/auth/logout/'
  const JWTAuthToken = localStorage.getItem('token')

  useEffect(() => {
    axios.get(fetchRoomsUrl, {
      headers: {
        Authorization: `Bearer ${JWTAuthToken}`
      }
    }).then((response) => {
      setAllRooms(response.data);
      console.log("All Rooms Fetched - ", response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [])


  useEffect(() => {
    axios.get(fetchUserInfoUrl, {
      headers: {
        Authorization: `Bearer ${JWTAuthToken}`
      }
    }).then((response) => {
      setUser(response.data);
      console.log('User info - ', response.data);
    }).catch((error) => {
      console.log(error);   
    })
  }, [])


  const addNewRoom = () => {
    if (newRoom.trim() === "") {
      console.log("Room Name cannot be Empty");
      return;
    }
    console.log('Creating room:', newRoom);
    axios.post(fetchRoomsUrl,
      { name: newRoom },
      { headers: { Authorization: `Bearer ${JWTAuthToken}`} } 
    ).then((response) => {
      console.log('Room created:', response.data);
      setAllRooms([...allRooms, response.data]);
      setNewRoom("");
    }).catch((error) => {
      console.log(error);
    });
  }

  const joinNewRoom = () => {
    if (joinRoom.trim() === "") {
      console.log("Please enter a valid Room Code");
      return;
    }
    axios.post(fetchJoinRoomUrl + joinRoom + "/access/",
      { room_code: joinRoom },
      { headers: { Authorization: `Bearer ${JWTAuthToken}`}}
    ).then((response) => {
      if(response.data.room == null) {
        console.log(response.data.message);
      } else {
        setAllRooms([...allRooms, response.data.room]);
        console.log(response.data.message);
      }
      setJoinRoom("");
    }).catch((error) => {
      console.log("Enter a valid Room Code");
    });
  }


  const logoutUser = () => {
    axios.post(fetchLogoutUrl, 
      { refresh: localStorage.getItem('refreshToken')},
      { headers: { Authorization: `Bearer ${JWTAuthToken}`}}
    ).then((response) => {
      console.log(response.data.message);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/');
    }).catch((error) => {
      console.log(error);
    })
  }


  return (
    <div className="rooms-container">
      <header className="rooms-header">
        <h1>Hello, {user.name}!</h1>
        <button className="logout-btn" onClick={logoutUser}>Logout</button>
      </header>

      <section className="create-join-room-section">
        <div className="create-room-form">
          <input type="text" placeholder="Enter room name" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
          <button onClick={addNewRoom}>Create New Room</button>
        </div>
        <div className="join-room-form">
          <input type="text" placeholder="Enter room code" value={joinRoom} onChange={(e) => setJoinRoom(e.target.value)}/>
          <button onClick={joinNewRoom}>Join Room</button>
        </div>
      </section>

      <section className="room-list-section">
        <h3>My rooms</h3>
        <div className="room-list">
          {allRooms.map((room: any) => (
              <div key={room.id} className="room-card">
                <h4>{room.name}</h4>
                <p>Code: {room.room_code}</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
