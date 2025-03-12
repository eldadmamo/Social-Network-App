import logo from '../../assets/images/logo.svg';
import { FaCaretDown, FaCaretUp, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import './Header.scss';
import Avatar from '../avatar/Avatar';
import { Utils } from '../../services/utils/utils.service';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import MessageSidebar from '../message-sidebar/MessageSidebar';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '../dropdown/Dropdown';
import useEffectOnce from './../../hooks/useEffectOnce';
import { ProfileUtils } from '../../services/utils/profile-utils.service';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from './../../hooks/useLocalStorage';
import useSessionStorage from './../../hooks/useSessionStorage';
import { userService } from '../../services/api/user/user.service';
import HeaderSkeleton from './HeaderSkeleton';
import { notificationService } from '../../services/api/notifications/notification.service';
import { NotificationUtils } from '../../services/utils/notification-utils.service';
import NotificationPreview from '../dialog/NotificationPreview';
import { socketService } from '../../services/socket/socket.service';

const Header = () => {
    const {profile} = useSelector(state => state.user);
    const [enviroment, setEnviroment] = useState('');
    const [settings, setSettings] = useState([]);
    const [notifications, setNotifications] = useState([])
    const [notificationCount, setNotificationCount] = useState(0)
    const [notificationDialogContent, setNotificationDialogContent] = useState({
      post: '', 
      imgUrl: '',
      comment: '',
      reaction: '',
      senderName: ''
    })
    const messageRef = useRef(null);
    const notificationRef = useRef(null);
    const settingsRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(messageRef, false);
    const [isNotificationActive, setNotificationActive] = useDetectOutsideClick(notificationRef, false);
    const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(settingsRef, false);
    const storedUsername = useLocalStorage('username', 'get')
    const [deleteStorageUsername] = useLocalStorage('username', 'delete')
    const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set')
    const [deleteSessionPageReload] = useSessionStorage('pageReload', 'delete')

    const backgroundColor = `${enviroment === 'DEV' ? '#50b5ff': enviroment === 'STG' ? '#e9710f': ''}`

    const getUserNotifications = async () => {
      try {
        const response = await notificationService.getUserNotifications();
        const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
          response.data.notifications,
          setNotificationCount
        );
        setNotifications(mappedNotifications);
        socketService?.socket.emit('setup', { userId: storedUsername });
      } catch (error) {
        Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
      }
    };
    
    const onMarkAsRead = async (notification) => {
        try {
          NotificationUtils.markMessageAsRead(notification?._id, notification, setNotificationDialogContent);
        } catch (error) {
          Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
        }
      };
    
    const onDeleteNotification = async (messageId) => {
        try{
          const response = await notificationService.deleteNotification(messageId);
          Utils.dispatchNotification(response.data.message, 'success', dispatch)
        }catch(error){
          Utils.dispatchNotification(error.response.data.mesage, 'error', dispatch)
        }
      }

    const openChatPage = () => {}

    const onLogout = async () => {
      try{
        setLoggedIn(false);
        Utils.clearStore({dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn});
        await userService.logoutUser();
        navigate('/')
      }catch(error){
        Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
      }
    } 

    useEffectOnce(()=> {
        Utils.mapSettingsDropdownItems(setSettings);
        getUserNotifications();
    })
    useEffect(()=> {
      const env = Utils.appEnviroment();
      setEnviroment(env);
  },[])

  useEffect(() => {
    NotificationUtils.socketIONotification(profile, notifications, setNotifications, 'header', setNotificationCount);
  }, [profile, notifications]);

  return (
    <>
    {!profile ? (
      <HeaderSkeleton/>
    ): (
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
        {notificationDialogContent?.senderName && (
                <NotificationPreview
                title="Your Post"
                post={notificationDialogContent?.post}
                imgUrl={notificationDialogContent?.imgUrl}
                comment={notificationDialogContent?.comment}
                reaction={notificationDialogContent?.reaction}
                senderName={notificationDialogContent?.senderName}
                secondButtonText="Close"
                secondBtnHandler={()=> {
                  setNotificationDialogContent({
                    post: '',
                    imgUrl:'',
                    comment: '',
                    reaction: '',
                    senderName: ''
                  })
                }}
                />
          )}
          <div className="header-navbar">
            <div className="header-image" data-testid="header-image" onClick={()=> navigate('/app/social/streams')}>
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
                    {notificationCount > 0 && (
                  <span className="bg-danger-dots dots" data-testid="notification-dots">
                    {notificationCount}
                  </span>
                    )}
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <Dropdown
                      height={300}
                      style={{right: '250px', top: '20px'}}
                      data={notifications}
                      notificationCount={notificationCount}
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
                  setIsSettingsActive(!isSettingsActive)
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
                      data={settings}
                      notificationCount={0}
                      title="Settings" 
                      onLogout={onLogout}
                      onNavigate={()=> ProfileUtils.navigateToProfile(profile, navigate)}
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
    )
    }
      
    </>
  );
};
export default Header;
