import React, { useCallback, useEffect, useState } from 'react'
import BackgroundHeader from '../../../components/BackgroundHeaderSkeleton.jsx/BackgroundHeader'
import { useDispatch, useSelector } from 'react-redux'
import { Utils } from '../../../services/utils/utils.service';
import { userService } from '../../../services/api/user/user.service';
import { useParams, useSearchParams } from 'react-router-dom';
import { tabItems } from '../../../services/utils/static.data';
import './profile.scss'
import { AddImage } from './../../../../../backend/src/features/images/controllers/add-image';
import { Utils } from './../../../services/utils/utils.service';
import { imageService } from './../../../services/api/image/image.service';

const Profiles = () => {
  const {profile} = useSelector((state) => state.user);
  const [user, setUser] = useState();
  const [rendered, setRendered] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [hasImage, setHasImage] = useState(false)
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('')
  const [bgUrl, setBgUrl] = useState('')
  const [galleryImages, setGalleryImages] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [displayContent, setDisplayContent] = useState('timeline');
  const [loading , setLoading]  = useState(true)
  const [userProfileData, setUserProfileData] = useState(null)
  const dispatch = useDispatch();
  const {username} = useParams();
  const [searchParams] = useSearchParams();

  const changeTabContent = (data) => {
    setDisplayContent(data);
  }

  const selectedFileImage = (data, type) => {
    setHasImage(!hasImage);
    if (type === 'background'){
      setSelectedBackgroundImage(data);
    } else {
      setSelectedProfileImage(data)
    }
  }

  const getUserProfileByUsername = useCallback(async ()=>  {
    try{
      const response = await userService.getUserProfileByUsername(
        username, 
        searchParams.get('id'),
        searchParams.get('uId')
      );
      setUser(response.data.user);
      setUserProfileData(response.data);
      setBgUrl(Utils.getImage(response.data.user?.bgImageId, response.data.user?.bgImageVersion))
      setLoading(false);
    }catch(error){
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  },[dispatch , searchParams, username])

  const saveImage = (type) => {
    const reader = new FileReader();
    reader.addEventListener('load', async () => addImage(reader.result, type), false);

    if (selectedBackgroundImage && typeof selectedBackgroundImage !== 'string'){
      reader.readAsDataURL(Utils.renameFile(selectedBackgroundImage));
    } else if(selectedProfileImage && typeof selectedProfileImage !== 'string') {
      reader.readAsDataURL(Utils.renameFile(selectedProfileImage));
    } else {
      addImage(selectedBackgroundImage, type);
    }
  };

  const addImage = async (result, type) => {
    try{
      const url = type === 'background' ? '/images/background' :'/images/profile'
      const response = await imageService.addImage(url, result);
      if(response){
        Utils.dispatchNotification(error.response.data.message, 'success', dispatch);
        setHasError(false)
        setHasImage(false)
      }
    }catch(error){
      setHasError(true)
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }

  const removeBackgroundImage = (type) => {};

  const cancelFileSelection = () => {
    setHasImage(!hasImage);
    setSelectedBackgroundImage('');
    setSelectedProfileImage('');
    setHasError(false)
  }

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
            loading={loading}
            hasImage={hasImage}
            hasError={hasError}
            url={bgUrl}
            onClick={changeTabContent}
            selectedFileImage={selectedFileImage}
            saveImage={saveImage}
            cancelFileSelection={cancelFileSelection}
            removeBackgroundImage={removeBackgroundImage}
            tabItems={tabItems(username === profile?.username, username === profile?.username)}
            tab={''}
            hideSettings={username === profile?.username}
            galleryImages={galleryImages}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profiles
