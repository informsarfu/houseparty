import React from 'react'
import './LoginSignup.css'

export const LoginSignup = () => {
  return (
    <div className='container'>
        <div className='header'>
            <div className='text'>Sign-up</div>
            <div className='underline'></div>
        </div>
        <div className='inputs'>
            <div className='input'>
                <input type="text" className='input-field' placeholder='Name' />
            </div>
            <div className='input'>
                <input type="text" className='input-field' placeholder='Username' />
            </div>
            <div className='input'>
                <input type="password" className='input-field' placeholder='Password' />
            </div>
        </div>
        <div className="submit-container">
            <div className="submit">Sign-up</div>
            <div className="submit">Login</div>
        </div>
    </div>
  )
}
