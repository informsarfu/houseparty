import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import './MyRooms.css'

export const MyRooms = () => {
  const [loading, setLoading] = useState(false);
  const [allRooms, setAllRooms] = useState([]);

  const fetchRoomsUrl = 'http://127.0.0.1:8000/api/rooms/'
  const JWTAuthToken = localStorage.getItem('token')

  useEffect(() => {
    axios.get(fetchRoomsUrl, {
      headers: {
        Authorization: `Bearer ${JWTAuthToken}`
      }
    }).then((response) => {
      setAllRooms(response.data);
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [])


  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await axios.get(fetchRoomsUrl, {
  //         headers: {
  //           Authorization: `Bearer ${JWTAuthToken}`
  //         }
  //       });
  //       setAllRooms(data.data);
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setLoading(false);
  //   }
  //   fetchData();
  // }, [])

  return (
    <div className="rooms-container">
      <header className="rooms-header">
        <h1>Hello, User</h1>
      </header>

      <section className="create-join-room-section">
        <div className="create-room-form">
          <input type="text" placeholder="Enter room name" />
          <button>Create New Room</button>
        </div>
        <div className="join-room-form">
          <input type="text" placeholder="Enter room code" />
          <button>Join Room</button>
        </div>
      </section>

      <section className="room-list-section">
        <h3>My rooms</h3>
        <div className="room-list">
          <div className="room-card">
            <h4>Example Room</h4>
            <p>Code: ABC123</p>
          </div>
        </div>
      </section>
    </div>
  )
}
