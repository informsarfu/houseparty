import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import './MyRooms.css'

export const MyRooms = () => {
  const [loading, setLoading] = useState(false);
  const [allRooms, setAllRooms] = useState<string[]>([]);
  const [user, setUser] = useState({id: null, name: null, username: null});
  const [newRoom, setNewRoom] = useState("");

  const fetchRoomsUrl = 'http://127.0.0.1:8000/api/rooms/'
  const fetchUserInfoUrl = 'http://127.0.0.1:8000/api/auth/userinfo/'
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
    console.log('Creating room:', newRoom);
    axios.post(fetchRoomsUrl,
      { name: newRoom},
      {headers: { Authorization: `Bearer ${JWTAuthToken}`}}
    ).then((response) => {
      console.log('Room created:', response.data);
      setAllRooms([...allRooms, response.data]);
      setNewRoom("");
    }).catch((error) => {
      console.log(error);
    });
  }


  return (
    <div className="rooms-container">
      <header className="rooms-header">
        <h1>Hello, {user.name}!</h1>
      </header>

      <section className="create-join-room-section">
        <div className="create-room-form">
          <input type="text" placeholder="Enter room name" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
          <button onClick={addNewRoom}>Create New Room</button>
        </div>
        <div className="join-room-form">
          <input type="text" placeholder="Enter room code" />
          <button>Join Room</button>
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
