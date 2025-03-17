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

    useEffect(()=> {
    if (debounceValue){
        searchUsers(debounceValue);
     }
    },[debounceValue,searchUsers])

    useEffect(() => {
        console.log(selectedUser,componentType,chatMessageList);
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