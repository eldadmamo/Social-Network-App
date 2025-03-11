import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Utils } from '../../../services/utils/utils.service';
import { FaCircle } from 'react-icons/fa';
import Avatar from '../../../components/avatar/Avatar';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import CardElementStats from '../../../components/card-element/CardElementStats';
import CardElementButton from '../../../components/card-element/CardElementButton';
import { useDispatch } from 'react-redux';
import { userService } from '../../../services/api/user/user.service';
import { uniqBy } from 'lodash';
import { ProfileUtils } from '../../../services/utils/profile-utils.service';
import { useNavigate } from 'react-router-dom';
import './people.scss'

const People = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers] = useState([])
  const [loading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  const navigate = useNavigate();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchData);
  const dispatch = useDispatch();

  const PAGE_SIZE = 12;

  function fetchData(){
    let pageNum = currentPage;
    if(currentPage <= Math.round(totalUsersCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllUsers();
    }
  }

  const getAllUsers = useCallback(async ()=> {
    try{
      const response = await userService.getAllUsers(currentPage);
      console.log(response.data.users);
      if(response.data.users.length > 0){
        setUsers((data) => {
          const result = [...data,...response.data.users];
          const allUsers = uniqBy(result, '_id');
          return allUsers;
        })
      }
      setTotalUsersCount(response.data.totalUsers);

      setLoading(false);
    }catch(error){
      setLoading(false);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  },[currentPage, dispatch]);

  const followUser = async (user) => {

  }

  const unfollowUser = async (user) => {

  }

  useEffect(()=> {
    getAllUsers();
  },[])


  return (
    <div className='card-container' ref={bodyRef}>
      <div className='people'>People</div>
      {users.length > 0 && (
        <div className='card-element'>
        {users.map((data,index) => (
          <div className='card-element-item' key={index} data-testid="card-element-item">
            {Utils.checkIfUserIsOnline(data?.username, onlineUsers) && (
              <div className='card-element-item-indicator'>
                  <FaCircle className='online-indicator'/>
              </div>
            )}
            <div className='card-element-header'>
              <div className='card-element-header-bg'></div>
                <Avatar
                name={data?.username}
                bgColor={data?.avatarColor}
                textColor="#ffffff"
                size={120}
                avatarSrc={data?.profilePicture}
                />
                <div className='card-element-header-text'>
                  <span className='card-element-header-name'>{data?.username}</span>
                </div>
              
            </div>
            <CardElementStats 
            postsCount={data?.postsCount}
            followersCount={data?.followersCount}
            followingCount={data?.followingCount}
            />
            <CardElementButton
            isChecked={Utils.checkIfUserIsFollowed([], data?._id)}
            btnTextOne="Follow"
            btnTextTwo="Unfollow"
            onClickBtnOne={() => followUser(data)}
            onClickBtnTwo={()=> unfollowUser(data)}
            onNavigateToProfile={()=> ProfileUtils.navigateToProfile(data, navigate)}
            />
          </div>
        ))}
      </div>
      )}

      {loading && !users.length && 
      <div className='card-element' style={{height: '350px'}}>
       
      </div>
      }

      {!loading && !users.length && (
        <div className='empty-page' data-testid="empty-page">
          No user available
        </div>
      )} 

      <div ref={bottomLineRef} style={{marginBottom: '80px', height: '50px'}}></div>

    </div>
  )
}

export default People
