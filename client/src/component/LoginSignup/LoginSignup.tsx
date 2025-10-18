import { useState, useEffect } from 'react';
import axios from 'axios';

import './LoginSignup.css'

export const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/token/', {
                    username,
                    password
                });
                console.log("Login successful:", response.data);
            } else {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', {
                    name,
                    username,
                    password
                });
                alert('User registered successfully! You can log in now.');
                console.log("Signup successful:", response.data);
                setIsLogin(true);
            }
            }
        catch (err: any) {
            setError(err.response?.data?.detail || 'An error occurred. Please try again.');
            alert(error);
        }
        finally {
            setLoading(false);
            setUsername("");
            setPassword("");
            setName("");
        }
    }

  return (
    <div className='container'>
        <div className='header'>
            <div className='text'>{isLogin ? "Login" : "Sign up"}</div>
            <div className='underline'></div>
        </div>
        <div className='inputs'>
            {!isLogin && (
                <div className='input'>
                    <input type="text" 
                            className='input-field' 
                            placeholder='Name' 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}/>
                </div>
            )}
            <div className='input'>
                <input type="text" 
                        className='input-field' 
                        placeholder='Username' 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className='input'>
                <input type="password" 
                        className='input-field' 
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
            </div>
        </div>
        <div className="submit-container">
            <button className="submit main-submit" onClick={handleSubmit}>Submit</button>
        </div>
        <div className="submit-container">
            <div className={isLogin === false ? "submit blue" : "submit"} onClick={() => setIsLogin(false)}>Sign-up</div>
            <div className={isLogin === true ? "submit blue" : "submit"} onClick={() => setIsLogin(true)}>Login</div>
        </div>
    </div>
  )
}
