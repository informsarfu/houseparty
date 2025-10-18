import { useState } from 'react';
import axios from 'axios';

import './LoginSignup.css'

export const LoginSignup = () => {
    
    const [isLogin, setIsLogin] = useState(true);
    console.log(isLogin);

  return (
    <div className='container'>
        <div className='header'>
            <div className='text'>{isLogin ? "Login" : "Sign up"}</div>
            <div className='underline'></div>
        </div>
        <div className='inputs'>
            {!isLogin && (
                <div className='input'>
                    <input type="text" className='input-field' placeholder='Name' />
                </div>
            )}
            <div className='input'>
                <input type="text" className='input-field' placeholder='Username' />
            </div>
            <div className='input'>
                <input type="password" className='input-field' placeholder='Password' />
            </div>
        </div>
        <div className="submit-container">
            <button className="submit main-submit">Submit</button>
        </div>
        <div className="submit-container">
            <div className={isLogin === false ? "submit blue" : "submit"} onClick={() => setIsLogin(false)}>Sign-up</div>
            <div className={isLogin === true ? "submit blue" : "submit"} onClick={() => setIsLogin(true)}>Login</div>
        </div>
    </div>
  )
}
