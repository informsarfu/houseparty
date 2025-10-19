import React from 'react'
import axios, { all } from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import './MyRooms.css'
import copyIcon from '../../assets/copy_clipboard.png';

export const MyRooms = () => {
  // const [loading, setLoading] = useState(false);
  const [allRooms, setAllRooms] = useState<any>([]);
  const [user, setUser] = useState({id: null, name: null, username: null});
  const [newRoom, setNewRoom] = useState("");
  const [joinRoom, setJoinRoom] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [allFiles, setAllFiles] = useState<any[]>([]);
  const initialRender = useRef(true);
  const fileInput = useRef<HTMLInputElement>(null);


  const navigate = useNavigate();

  const baseUrl = "http://127.0.0.1:8000/"
  const fetchRoomsUrl = 'http://127.0.0.1:8000/api/rooms/'
  const fetchUserInfoUrl = 'http://127.0.0.1:8000/api/auth/userinfo/'
  const fetchLogoutUrl = 'http://127.0.0.1:8000/api/auth/logout/'
  const JWTAuthToken = `Bearer ${localStorage.getItem('token')}`

  //fetch all rooms for user
  useEffect(() => {
    axios.get(fetchRoomsUrl, {
      headers: {
        Authorization: JWTAuthToken
      }
    })
    .then((response) => {
      setAllRooms(response.data);
      console.log("All Rooms Fetched - ", response.data);
    })
    .catch((error) => {
      console.log("Error while fetching rooms -> ", error);
    });
  }, [])

  //fetch user info
  useEffect(() => {
    axios.get(fetchUserInfoUrl, {
      headers: {
        Authorization: JWTAuthToken
      }
    })
    .then((response) => {
      setUser(response.data);
      console.log('User info - ', response.data);
    })
    .catch((error) => {
      console.log("Error while fetching user info -> ", error); 
    })
  }, [])

  //fetch all files related to a room
  useEffect(() => {
    if(initialRender.current){
      return;
    }
    axios.get(fetchRoomsUrl + selectedRoom?.room_code + '/files/', 
      {headers: { Authorization: JWTAuthToken}}
    )
    .then((response) => {
      setAllFiles(response.data);
      console.log("All Files for the user", allFiles);
    })
    .catch((error) => {
      console.log("Error while fetching files ", error);
    })
  }, [modalOpen])


  //add new room for user
  const handleCreateRoom = () => {
    if (newRoom.trim() === "") {
      console.log("Room Name cannot be Empty");
      return;
    }
    console.log('Creating room:', newRoom);
    axios.post(fetchRoomsUrl,
      { name: newRoom },
      { headers: { Authorization: JWTAuthToken} } 
    )
    .then((response) => {
      console.log('Room created:', response.data);
      setAllRooms([...allRooms, response.data]);
      setNewRoom("");
    })
    .catch((error) => {
      console.log("Error while adding new room ", error);
    });
  }

  
  // join a room for user
  const handleJoinRoom = () => {
    if (joinRoom.trim() === "") {
      console.log("Please enter a valid Room Code");
      return;
    }
    axios.post(fetchRoomsUrl + joinRoom + "/access/",
      { room_code: joinRoom },
      { headers: { Authorization: JWTAuthToken}}
    )
    .then((response) => {
      if(response.data.room == null) {
        console.log(response.data.message);
      } else {
        setAllRooms([...allRooms, response.data.room]);
        console.log(response.data.message);
      }
      setJoinRoom("");
    })
    .catch((error) => {
      console.log("Enter a valid Room Code", error);
    });
  }


  //Logout user
  const handleLogout = () => {
    axios.post(fetchLogoutUrl, 
      { refresh: localStorage.getItem('refreshToken')},
      { headers: { Authorization: JWTAuthToken}}
    )
    .then((response) => {
      console.log(response.data.message);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/');
    })
    .catch((error) => {
      console.log("Error while logging out -> ", error);
    })
  }

//delete room
  const handleDeleteRoom = (room_code: string) => {
    axios.delete(fetchRoomsUrl + room_code, 
      { headers: { Authorization: JWTAuthToken}}
    )
    .then((response) => {
      console.log(response.data.message);
      setAllRooms(allRooms.filter((room: any) => room.room_code !== room_code));
    })
    .catch((error) => {
      console.log("Error while deleting room -> ", error);
    });
  }


  //leave room for user
  const handleLeaveRoom = (room_code: string) => {
    axios.delete(fetchRoomsUrl + room_code + "/access/", 
      { headers: { Authorization: JWTAuthToken}}
    )
    .then((response) => {
      console.log(response.data.message);
      setAllRooms(allRooms.filter((room: any) => room.room_code !== room_code));
    })
    .catch((error) => {
      console.log("Error while leaving room -> ", error);
    });
  }


  //delete a file
  const handleDeleteFile = (file_id: string) => {
    axios.delete(fetchRoomsUrl + selectedRoom.room_code + "/files/", 
      { 
        headers: { Authorization: JWTAuthToken},
        data: {file_id: file_id}
      }
    )
    .then((response) => {
      console.log(response.data.message);
      setAllFiles(allFiles.filter((file: any) => file.id !== file_id));
    })
    .catch((error) => {
      console.log("Error while leaving room -> ", error);
    });
  }


  //upload a file
  const handleUploadFile = () => {
    console.log("Upload files.. -> ", fileInput.current?.files);
    const file = fileInput.current?.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    let formData = new FormData();
    formData.append("file", file);

    axios.post(fetchRoomsUrl + selectedRoom.room_code + "/files/", formData, 
      {
        headers: { 
          Authorization: JWTAuthToken,
          "Content-Type": "multipart/form-data"
        }
     })
     .then((response) => {
      console.log(response);
      setAllFiles((prevFiles) => [...prevFiles, response.data]);
     })
     .catch((error) => {
      console.log("File upload failed -> ", error)
     })
  }


  return (
    <div className="rooms-container">
      <header className="rooms-header">
        <h1>Hello, {user.name}!</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <section className="create-join-room-section">
        <div className="create-room-form">
          <input type="text" placeholder="Enter room name" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
          <button onClick={handleCreateRoom}>Create New Room</button>
        </div>
        <div className="join-room-form">
          <input type="text" placeholder="Enter room code" value={joinRoom} onChange={(e) => setJoinRoom(e.target.value)}/>
          <button onClick={handleJoinRoom}>Join Room</button>
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
                <p>Code: <span className="code-text">{room.room_code}</span>
                  <button className="copy-btn" onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(room.room_code);
                  }
                  }>
                    <img
                      src={copyIcon}
                      alt="Copy to Clipboard"
                      width="15"
                      height="15"
                    />
                  </button>
                </p>
                <button className='leave-btn' 
                  onClick={e => {
                    e.stopPropagation();
                    handleLeaveRoom(room.room_code)}}>
                    Leave
                </button>
                {room.host === user.id && 
                <button className='delete-btn' 
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteRoom(room.room_code)}}>
                    Delete
                </button>
                }
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
            <div className="modal-header">
              <button
                className="upload-btn"
                onClick={() => fileInput.current?.click()}
              >
                Upload File
              </button>
              <input
                ref={fileInput}
                type="file"
                hidden
                onChange={handleUploadFile}
              />
              
              <div className="room-info">
                <h2>{selectedRoom?.name}</h2>
              </div>
              <button className='close-btn' onClick={() => {
                setModalOpen(false);
                setAllFiles([]);
                }}>X</button>
            </div>
            <div className="files-grid">
              {allFiles.length > 0 && allFiles.map((file: any) => {
                  const fileUrl = file.file;
                  const extension = fileUrl.split('.').pop().toLowerCase();
                  const fullFileUrl = baseUrl + fileUrl

                  return (
                    <div key={file.id} className="file-preview">
                      {['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension) ? (
                        <img src={fullFileUrl} alt="Uploaded file" className="preview-image" />
                      ) : extension === 'pdf' ? (
                        <embed width="400" height="400" src={fullFileUrl} type="application/pdf"/>    
                      ) : (
                        <p>Preview not available</p>
                      )}

                      <p>{fullFileUrl.split('/').pop()}</p>
                      {(file.uploaded_by == user.id || user.id == selectedRoom.host) && 
                      <button className="delete-file-btn" onClick={(e) => handleDeleteFile(file.id)}>
                        delete
                      </button>}
                    </div>
                  )
                })
              }
              {allFiles.length === 0 && <p>No Files Available</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
