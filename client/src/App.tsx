import { useState, useEffect } from "react";
import { LoginSignup } from "./component/LoginSignup/LoginSignup";
import { MyRooms } from "./component/MyRooms/MyRooms";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/my-rooms" element={<MyRooms />} />
{/* 
        <Route element={<ProtectedRoutes/>}>
          
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;