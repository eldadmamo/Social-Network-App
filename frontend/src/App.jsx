import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routes'
import { useEffect } from 'react'
import '../src/App.scss'
import { socketService } from './services/socket/socket.service'

const App = () => {

  useEffect(()=> {
    socketService.setupSocketConnection();
  },[])

  return (
    <>
     <BrowserRouter>
       <AppRouter/>
     </BrowserRouter>
    </>
  )
}

export default App
