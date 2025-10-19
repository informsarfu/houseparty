import React from 'react'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import './MyRooms.css'

export const MyRooms = () => {
  // const [loading, setLoading] = useState(false);
  const [allRooms, setAllRooms] = useState<string[]>([]);
  const [user, setUser] = useState({id: null, name: null, username: null});
  const [newRoom, setNewRoom] = useState("");
  const [joinRoom, setJoinRoom] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [allFiles, setAllFiles] = useState([]);
  const initialRender = useRef(true);

  const navigate = useNavigate();

  const fetchRoomsUrl = 'http://127.0.0.1:8000/api/rooms/'
  const fetchUserInfoUrl = 'http://127.0.0.1:8000/api/auth/userinfo/'
  const fetchRoomAccess = 'http://127.0.0.1:8000/api/rooms/'
  const fetchLogoutUrl = 'http://127.0.0.1:8000/api/auth/logout/'
  const JWTAuthToken = `Bearer ${localStorage.getItem('token')}`

  //fetch all rooms for user
  useEffect(() => {
    axios.get(fetchRoomsUrl, {
      headers: {
        Authorization: JWTAuthToken
      }
    }).then((response) => {
      setAllRooms(response.data);
      console.log("All Rooms Fetched - ", response.data);
    }).catch((error) => {
      console.log("Error while fetching rooms -> ", error);
    });
  }, [])

  //fetch user info
  useEffect(() => {
    axios.get(fetchUserInfoUrl, {
      headers: {
        Authorization: JWTAuthToken
      }
    }).then((response) => {
      setUser(response.data);
      console.log('User info - ', response.data);
    }).catch((error) => {
      console.log("Error while fetching user info -> ", error); 
    })
  }, [])

  //fetch all files related to a room
  useEffect(() => {
    if(initialRender.current){
      return;
    }
    axios.get(fetchRoomAccess + selectedRoom?.room_code + '/files/', 
      {headers: { Authorization: JWTAuthToken}}
    ).then((response) => {
      setAllFiles(response.data);
      console.log("All Files for the user", allFiles);
    }).catch((error) => {
      console.log("Error while fetching files ", error);
    })
  }, [modalOpen])

  //add new room for user
  const addNewRoom = () => {
    if (newRoom.trim() === "") {
      console.log("Room Name cannot be Empty");
      return;
    }
    console.log('Creating room:', newRoom);
    axios.post(fetchRoomsUrl,
      { name: newRoom },
      { headers: { Authorization: JWTAuthToken} } 
    ).then((response) => {
      console.log('Room created:', response.data);
      setAllRooms([...allRooms, response.data]);
      setNewRoom("");
    }).catch((error) => {
      console.log("Error while adding new room ", error);
    });
  }

  // join a room for user
  const joinNewRoom = () => {
    if (joinRoom.trim() === "") {
      console.log("Please enter a valid Room Code");
      return;
    }
    axios.post(fetchRoomAccess + joinRoom + "/access/",
      { room_code: joinRoom },
      { headers: { Authorization: JWTAuthToken}}
    ).then((response) => {
      if(response.data.room == null) {
        console.log(response.data.message);
      } else {
        setAllRooms([...allRooms, response.data.room]);
        console.log(response.data.message);
      }
      setJoinRoom("");
    }).catch((error) => {
      console.log("Enter a valid Room Code", error);
    });
  }

  //Logout user
  const logoutUser = () => {
    axios.post(fetchLogoutUrl, 
      { refresh: localStorage.getItem('refreshToken')},
      { headers: { Authorization: JWTAuthToken}}
    ).then((response) => {
      console.log(response.data.message);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/');
    }).catch((error) => {
      console.log("Error while logging out -> ", error);
    })
  }

  //leave room for user
  const leaveRoom = (room_code: string) => {
    axios.delete(fetchRoomAccess + room_code + "/access/", 
      { headers: { Authorization: JWTAuthToken}}
    ).then((response) => {
      console.log(response.data.message);
      setAllRooms(allRooms.filter((room: any) => room.room_code !== room_code));
    }).catch((error) => {
      console.log("Error while leaving room -> ", error);
    });
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
              <div 
                key={room.id} 
                className="room-card" 
                onClick={() => {
                  if (window.getSelection && window.getSelection()?.toString()) return;
                  setModalOpen(true);
                  setSelectedRoom(room);
                  initialRender.current = false;
                }}>
                  
                <h4>{room.name}</h4>
                <p>Code: {room.room_code}</p>
                <button className='deleteBtn' 
                  onClick={e => {
                    e.stopPropagation();
                    leaveRoom(room.room_code)}}>
                    Leave
                </button>
              </div>
            ))}
        </div>
      </section>
      {modalOpen && (
        <div className="modal-overlay" onClick={() => {
          setModalOpen(false);
          setAllFiles([]);
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedRoom?.name}</h2>
            <p>Code: {selectedRoom?.room_code}</p>
            <button onClick={() => {
              setModalOpen(false);
              setAllFiles([]);
              }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
