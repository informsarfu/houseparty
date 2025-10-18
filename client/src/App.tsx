import { useState, useEffect } from "react";
import { LoginSignup } from "./component/LoginSignup/LoginSignup";
import { MyRooms } from "./component/MyRooms/MyRooms";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
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