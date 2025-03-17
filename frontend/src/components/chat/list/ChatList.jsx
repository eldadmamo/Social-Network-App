import React from 'react'
import Avatar from '../../avatar/Avatar'
import { FaSearch, FaTimes } from 'react-icons/fa'
import Input from '../../input/input'
import { useSelector } from 'react-redux'
import { Utils } from '../../../services/utils/utils.service'
import './ChatList.scss'

const ChatList = () => {
    const {profile} = useSelector((state) => state.user);
     
  return (
    <div data-testid="chatList">
    <div className="conversation-container">
        <div className="conversation-container-header">
            <div className="header-img">
                <Avatar name={profile?.username} bgColor={profile?.avatarColor} textColor="#ffffff" size={40}
                    avatarSrc={profile?.profilePicture} />
            </div>
            <div className="title-text">{profile?.username}</div>
        </div>

        <div className="conversation-container-search" data-testid="search-container">
            <FaSearch className="search" />
            <Input id="message" name="message" type="text" className="search-input" labelText="" placeholder="Search" />
            <FaTimes className="times" />
        </div>

        <div className="conversation-container-body">
            <div className="conversation">
                {[].map((data) => (
                <div key={Utils.generateString(10)} data-testid="conversation-item" className="conversation-item">
                    <div className="avatar">
                        <Avatar name="placeholder" bgColor="red" textColor="#ffffff" size={40} avatarSrc="" />
                    </div>
                    <div className="title-text">
                        Danny
                    </div>
                    <div className="created-date">1 hr ago</div>
                    <div className="created-date" >
                        <FaTimes />
                    </div>
                    
                    <div className="conversation-message">
                        <span className="message-deleted">message deleted</span>
                    </div>
                    <div className="conversation-message">
                        <span className="message-deleted">message deleted</span>
                    </div>
                    
                </div>
                ))}
            </div>

            
        </div>
    </div>
</div>
  )
}

export default ChatList