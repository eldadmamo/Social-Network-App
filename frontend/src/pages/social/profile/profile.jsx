import React, { useCallback, useEffect, useState } from 'react'
import BackgroundHeader from '../../../components/background-header/BackgroundHeader'
import { useDispatch, useSelector } from 'react-redux'
import { Utils } from '../../../services/utils/utils.service';
import { userService } from '../../../services/api/user/user.service';
import { useParams, useSearchParams } from 'react-router-dom';
import { tabItems } from '../../../services/utils/static.data';
import './profile.scss'

const Profiles = () => {
  const {profile} = useSelector((state) => state.user);
  const [user, setUser] = useState();
  const [rendered, setRendered] = useState(false)
  const dispatch = useDispatch();
  const {username} = useParams();
  const {searchParams} = useSearchParams();

  const getUserProfileByUsername = useCallback(async ()=>  {
    try{
      const response = await userService.getUserProfileByUsername(
        username, 
        searchParams.get('id'),
        searchParams.get('uId')
      );
      setUser(response.data.user);
    }catch(error){
      Utils.dispatchNotification(error.response.data.message, 'error', disptch);
    }
  },[dispatch , searchParams, username])

  useEffect(()=> {
    if (rendered){
      getUserProfileByUsername();
    }
    if(!rendered) setRendered(true);
  },[rendered, getUserProfileByUsername])

  return (
    <>
      <div className='profile-wrapper'>
        <div className='profile-wrapper-container'>
          <div className='profile-header'>
            <BackgroundHeader
            user={user}
            loading={false}
            hasImage={false}
            hasError={false}
            url={''}
            onClick={() => {}}
            selectedFileImage={() => {}}
            saveImage={() => {}}
            cancelFileSelection={() => {}}
            removeBackgroundImage={() => {}}
            tabItems={tabItems(username === profile?.username, username === profile?.username)}
            tab={{}}
            hideSettings={username === profile?.username}
            galleryImages={[]}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profiles
