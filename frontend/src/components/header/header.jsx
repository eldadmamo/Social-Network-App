import logo from '../../assets/images/logo.svg';
import { FaCaretDown, FaCaretUp, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import './Header.scss';
import Avatar from '../avatar/Avatar';
import { Utils } from '../../services/utils/utils.service';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import MessageSidebar from '../message-sidebar/MessageSidebar';
import { useSelector } from 'react-redux';
import Dropdown from '../dropdown/Dropdown';

const Header = () => {
    const {profile} = useSelector(state => state.user);
    const [enviroment, setEnviroment] = useState('');
    const messageRef = useRef(null);
    const notificationRef = useRef(null);
    const settingsRef = useRef(null);
    const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(messageRef, false);
    const [isNotificationActive, setNotificationActive] = useDetectOutsideClick(notificationRef, false);
    const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(settingsRef, false);
    

    const backgroundColor = `${enviroment === 'DEV' ? '#50b5ff': enviroment === 'STG' ? '#e9710f': ''}`

    const openChatPage = () => {}
    const onMarkAsRead = () => {}
    const onDeleteNotification = () => {}
    const onLogout = () => {} 

    useEffect(()=> {
        const env = Utils.appEnviroment();
        setEnviroment(env);
    },[])
  return (
    <>
      <div className="header-nav-wrapper" data-testid="header-wrapper">
        {isMessageActive && (
            <div ref={messageRef}>
                <MessageSidebar
                profile={profile}
                messageCount={0}
                messageNotifications={[]}
                openChatPage={openChatPage}
                />
            </div>
        )}
          <div className="header-navbar">
            <div className="header-image" data-testid="header-image">
              <img src={logo} className="img-fluid" alt="" />
              <div className="app-name">
                Social Network
                {enviroment && (
                    <span className="environment" style={{backgroundColor: `${backgroundColor}`}}>
                        {enviroment}
                    </span>
                )}
                <span className="environment">DEV</span>
              </div>
            </div>
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="header-nav">
              <li className="header-nav-item active-item" 
              onClick={() => {
                  setIsMessageActive(false)
                  setNotificationActive(true)
                  setIsSettingsActive(false)
                }
              }
              >
                <span className="header-list-name">
                    <FaRegBell className="header-list-icon" />
                    <span className="bg-danger-dots dots" data-testid="notification-dots"></span>
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <Dropdown
                      height={300}
                      style={{right: '250px', top: '20px'}}
                      data={[]}
                      notificationCount={0}
                      title="Notifications"
                      onMarkAsRead={onMarkAsRead}
                      onDeleteNotification={onDeleteNotification}
                      />
                    </li>
                </ul>
                )}
                &nbsp;
              </li>
              <li className="header-nav-item active-item" onClick={()=> {
                setIsMessageActive(true)
                setNotificationActive(false)
                setIsSettingsActive(false)
              }}>
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />
                  <span className="bg-danger-dots dots" data-testid="messages-dots"></span>
                </span>
                &nbsp;
              </li>
              <li className="header-nav-item" onClick={() => {
                  setIsMessageActive(false)
                  setNotificationActive(false)
                  setIsSettingsActive(true)
                }}>
                <span className="header-list-name profile-image">
                    <Avatar 
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff" 
                    size={40}
                    avatarSrc={profile?.profilePicture}
                    />
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {!isSettingsActive ? (
                    <FaCaretDown className="header-list-icon caret" />
                  ):(
                    <FaCaretUp className="header-list-icon caret" />
                  )}
                </span>
                {isSettingsActive && (
                  <ul className='dropdown-ul' ref={settingsRef}>
                    <li className='dropdown-li'>
                      <Dropdown 
                      height={300}
                      style={{right: '150px', top: '40px'}}
                      data={[]}
                      notificationCount={0}
                      title="Settings" 
                      onLogout={onLogout}
                      onNavigate={()=> {}}
                      />
                    </li>
                  </ul>
                )}

                <ul className="dropdown-ul">
                <li className="dropdown-li">
                    
                </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
    </>
  );
};
export default Header;
