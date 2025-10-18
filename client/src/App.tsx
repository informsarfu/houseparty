import { useState, useEffect } from "react";
import { LoginSignup } from "./component/LoginSignup/LoginSignup";
import { MyRooms } from "./component/MyRooms/MyRooms";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/core/health')
      .then(r => r.json())
      .then(d => setStatus(d.message))
      .catch(() => setStatus("Error connecting to API"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/my-rooms" element={<MyRooms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;