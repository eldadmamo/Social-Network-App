import React from 'react'
import { useSelector } from 'react-redux'
import Avatar from '../../avatar/Avatar';
import './ChatWindow.scss'
import MessageInput from './message-input/MessageInput';

const ChatWindow = () => {
    const {profile} = useSelector((state) => state.user);
    
    const sendChatMessage = () => {

    }

  return (
    <>
  <div className="chat-window-container" data-testid="chatWindowContainer">
    <div data-testid="chatWindow">
        <div className="chat-title" data-testid="chat-title">
            <div className="chat-title-avatar">
                <Avatar
                name={profile?.username} 
                bgColor={profile.avatarColor}
                textColor="#ffffff" 
                size={40} 
                avatarSrc={profile.profilePicture} 
                />
            </div>
            <div className="chat-title-items">
                <div className="chat-name user-not-online">
                    Sammy
                </div>
                <span className="chat-active">Online</span>
            </div>
        </div>
        <div className="chat-window">
            <div className="chat-window-message">
                Message Display component
            </div>
            <div className="chat-window-input">
            
                <MessageInput setChatMessage={sendChatMessage}/>

            </div>
        </div>
    </div>
  </div>
    </>
  )
}

export default ChatWindow
