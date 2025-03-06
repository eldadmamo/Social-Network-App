import React from 'react'
import Avatar from '../../../avatar/Avatar'
import { useSelector } from 'react-redux'

const ModalBoxContent = () => {
    const {profile} = useSelector((state) => state.user);

  return (
    <div className="modal-box-content" data-testid="modal-box-content">
    <div className="user-post-image" data-testid="box-avatar">
        <Avatar 
        name={profile?.username} 
        bgColor={profile?.avatarColor} 
        textColor="#ffffff" size={40}
        avatarSrc={profile?.profilePicture} />
    </div>
    <div className="modal-box-info">
        <h5 className="inline-title-display" data-testid="box-username">
            Danny
        </h5>
        <p className="inline-display" data-testid="box-feeling">
            is feeling <img className="feeling-icon" src="" alt="" /> <span>Happy</span>
        </p>
        <div data-testid="box-text-display" className="time-text-display">
            <div className="selected-item-text" data-testid="box-item-text">
                Feeling
            </div>
            <div>

            </div>
        </div>
    </div>
</div>
  )
}

export default ModalBoxContent
