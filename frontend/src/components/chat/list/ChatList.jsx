import React, { useCallback, useEffect, useState } from 'react'
import Avatar from '../../avatar/Avatar'
import { FaSearch, FaTimes } from 'react-icons/fa'
import Input from '../../input/input'
import { useDispatch, useSelector } from 'react-redux'
import { Utils } from '../../../services/utils/utils.service'
import './ChatList.scss'
import SearchList from './search-list/SearchList'
import { userService } from '../../../services/api/user/user.service'
import useDebounce from './../../../hooks/useDebounce';
import { ChatUtils } from '../../../services/utils/chat-utils.service'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setSelectedChatUser } from '../../../redux-toolkit/reducers/chat/chat.reducer'
import { chatService } from '../../../services/api/chat/chat.service'

const ChatList = () => {
    const {profile} = useSelector((state) => state.user);
    const {chatList} = useSelector((state) => state.chat);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [componentType, setComponentType] = useState('chatList')
    const [chatMessageList, setChatMessageList] = useState([]);
    const debounceValue = useDebounce(search, 1000);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const searchUsers = useCallback(
        async (query)=> {
        setIsSearching(true);
        try{
            setSearch(query);
            if(query){
                const response = await userService.searchUsers(query);
                setSearchResult(response.data.Search);
                setIsSearching(false);
            }
        }catch(error){
            setIsSearching(false)
            Utils.dispatchNotification(error.response.data.message, 'error', dispatch)
        }
    },[dispatch])

    const addSelectedUserToList = useCallback((user)=> {
        const newUser = {
        receiverId: user?._id,
        receiverUsername: user?.username,
        receiverAvatarColor: user?.avatarColor,
        receiverProfilePicture: user?.profilePicture,
        senderUsername: profile?.username,
        senderId: profile?._id,
        senderAvatarColor: profile?.avatarColor,
        senderProfilePicture: profile?.profilePicture,
        body: ''
        }
        ChatUtils.joinRoomEvent(user,profile);
        ChatUtils.privateChatMessages = [];
        const findUser = find(
        chatMessageList, 
        (chat) => chat.receiverId === searchParams.get('id') || chat.senderId === searchParams.get('id')
        );
        if(!findUser){
            const newChatList = [newUser, ...chatMessageList];
            setChatMessageList(newChatList);
            if(!chatList.length) {
                dispatch(setSelectedChatUser({isLoading: false, user: newUser}));
                const userTwoName = newUser?.receiverUsername !== profile?.username ? newUser?.receiverUsername : newUser?.senderUsername;
                chatService.addChatUsers({userOne: profile?.username, userTwo: userTwoName})
            }
        }
    },[chatList, chatMessageList, dispatch, searchParams, profile])

    useEffect(()=> {
    if (debounceValue){
        searchUsers(debounceValue);
     }
    },[debounceValue,searchUsers])

    useEffect(()=> {
        if (selectedUser && componentType === 'searchList'){
            addSelectedUserToList(selectedUser);
         }
        },[addSelectedUserToList, componentType, selectedUser])

    useEffect(() => {
        
        setChatMessageList(chatList);
    },[chatList])

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
            <Input id="message" name="message" type="text" value={search} className="search-input" labelText="" placeholder="Search" 
            handleChange={(event)=> {
                setIsSearching(true);
                setSearch(event.target.value)
            }} />
            {search && <FaTimes className="times" onClick={()=> {
                setSearch('')
                setIsSearching(false)
                setSearchResult([]);
            }} />}
            
        </div>

        <div className="conversation-container-body">
            <div className="conversation">
                {chatMessageList.map((data) => (
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

         <SearchList
         searchTerm={search}
         result={searchResult}
         isSearching={isSearching}
         setSearchResult={setSearchResult}
         setIsSearching={setIsSearching}
         setSearch={setSearch}
         setSelectedUser={setSelectedUser}
         setComponentType={setComponentType}
         />            
        </div>
    </div>
</div>
  )
}

export default ChatList