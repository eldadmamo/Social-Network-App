import './AuthTabs.scss'
import React from 'react'

const AuthTabs = () => {
  return (
    <>
      <div className='container-wrapper'>
        <div className='enviroment'>Dev</div>
        <div className='container-wrapper-auth'>
          <div className='tabs'>
            <div className='tabs-auth'>
              <ul className='tab-group'>
                <li className='tab active'>
                  <button className='login'>Sign In</button>
                </li>
                <li className='tab'>
                  <button className='signup'>Sign Up</button>
                </li>
              </ul>
              <div className='tab-item'>
                login components
              </div>
              <div className='tab-item'>
                register components
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthTabs
