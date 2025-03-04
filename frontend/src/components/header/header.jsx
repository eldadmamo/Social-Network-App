import logo from '../../assets/images/logo.svg';
import { FaCaretDown, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import './Header.scss';
import Avatar from '../avatar/Avatar';
import { Utils } from '../../services/utils/utils.service';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import MessageSidebar from '../message-sidebar/MessageSidebar';
import { useSelector } from 'react-redux';

const Header = () => {
    const {profile} = useSelector(state => state.user);
    const [enviroment, setEnviroment] = useState('');
    const messageRef = useRef(null);
    const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(messageRef, false);

    const backgroundColor = `${enviroment === 'DEV' ? '#50b5ff': enviroment === 'STG' ? '#e9710f': ''}`

    const openChatPage = () => {}

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
              <li className="header-nav-item active-item">
                <span className="header-list-name">
                    <FaRegBell className="header-list-icon" />
                    <span className="bg-danger-dots dots" data-testid="notification-dots"></span>
                </span>
                <ul className="dropdown-ul">
                    <li className="dropdown-li"></li>
                </ul>
                &nbsp;
              </li>
              <li className="header-nav-item active-item" onClick={()=> {
                setIsMessageActive(true)
              }}>
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />
                  <span className="bg-danger-dots dots" data-testid="messages-dots"></span>
                </span>
                &nbsp;
              </li>
              <li className="header-nav-item">
                <span className="header-list-name profile-image">
                    <Avatar 
                    name="eldads"
                    bgColor="red"
                    textColor="#ffffff" 
                    size={40}
                    avatarSrc=""
                    />
                </span>
                <span className="header-list-name profile-name">
                  Eldad
                  <FaCaretDown className="header-list-icon caret" />
                </span>
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
