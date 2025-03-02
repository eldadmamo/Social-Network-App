import './AuthTabs.scss'
import React from 'react'
import { useState } from 'react'
import backgroundImage from '../../../assets/images/background.jpg'

const AuthTabs = () => {
  const [type, setType] = useState('Sign In');


  return (
    <>
      <div className='container-wrapper' style={{backgroundImage: `url(${backgroundImage})` }}>
        <div className='environment'>Dev</div>
        <div className='container-wrapper-auth'>
          <div className='tabs'>
            <div className='tabs-auth'>
              <ul className='tab-group'>
                <li className='tab active' onClick={()=> setType('Sign In')}>
                  <button className='login'>Sign In</button>
                </li>
                <li className='tab'>
                  <button className='signup' onClick={()=> setType('Sign Up')}>Sign Up</button>
                </li>
              </ul>
              {
                type === 'Sign In' && <div className='tab-item'>
                  login components
                </div>
              }
              {
                type === 'Sign Up' && <div className='tab-item'>
                  signup components
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthTabs
