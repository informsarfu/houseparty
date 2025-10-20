import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');
  const [isValid, setIsValid] = useState(true);
  const verifyUrl = "http://127.0.0.1:8000/" + "api/auth/token/verify/";

  useEffect(() => {
    if(!token){
      setIsValid(false);
      return;
    }
    setIsValid(true);
  }, [token])

return (
    (isValid) ? <Outlet/> : <Navigate to='/'/>
  )
}

export default ProtectedRoutes