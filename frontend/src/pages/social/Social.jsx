import React from 'react'
import { Outlet } from 'react-router-dom'

import "./Social.scss"
import Header from '../../components/header/header'
import Sidebar from '../../components/sidebar/Sidebar'

const Social = () => {
  return (
    <>
      <Header/>
      <div className='dashboard'>
        <div className='dashboard-sidebar'>
            <Sidebar/>
        </div>
        <div className='dashboard-context'>
            <Outlet/>
        </div>
      </div>
    </>
  )
}

export default Social;
