import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routes'
import { useEffect } from 'react'
import '../src/App.scss'
import { socketService } from './services/socket/socket.service'
import Toast from './components/toast/Toast'
import { useSelector } from 'react-redux'

const App = () => {
  const {notifications} = useSelector((state) => state.notifications);

  useEffect(()=> {
    socketService.setupSocketConnection();
  },[])

  return (
    <>
     {notifications && notifications.length > 0 && (
      <Toast position="top-right" toastList={notifications} autoDelete={false} />
     )}
     <BrowserRouter>
       <AppRouter/>
     </BrowserRouter>
    </>
  )
}

export default App
