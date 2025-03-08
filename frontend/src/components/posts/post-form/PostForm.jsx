import React, { useRef, useState } from 'react'
import Avatar from '../../avatar/Avatar'
import Input from './../../input/input';
import { useDispatch, useSelector } from 'react-redux';
import photo from '../../../assets/images/photo.png'
import gif from '../../../assets/images/gif.png'
import feeling from '../../../assets/images/feeling.png'
import './PostForm.scss'
import { openModal, toggleFeelingModal, toggleGifModal, toggleImageModal } from '../../../redux-toolkit/reducers/model/modal.reducer';
import AddPost from '../post-modal/post-add/AddPost';
import { ImageUtils } from '../../../services/utils/image-utils.service';


const PostForm = () => {
    const {profile} = useSelector((state) => state.user);
    const {type, isOpen, openFileDialog, gifModalIsOpen, feelingIsOpen} = useSelector((state) => state.modal);
    const {selectedPostImage, setSelectedPostImage} = useState();
    const fileInputRef = useRef();
    const dispatch = useDispatch();

    const openPostModal = () => {
        dispatch(openModal({
            type: 'add'
        }));
    }

    const openImageModal = () => {
        fileInputRef.current.click();
        dispatch(openModal({type: 'add'}))
        dispatch(toggleImageModal(!openFileDialog))
    }

    const openGifModal = () => {
        dispatch(openModal({type: 'add'}))
        dispatch(toggleGifModal(!gifModalIsOpen))
    }

    const openFeelingsComponent = () => {
        dispatch(openModal({type: 'add'}))
        dispatch(toggleFeelingModal(!feelingIsOpen))
    }

    const handleFileChange = () => {
        ImageUtils.addFileToRedux(event, '', setSelectedPostImage, dispatch);
    }

  return (
    <>
  <div className="post-form" data-testid="post-form">
    <div className="post-form-row">
        <div className="post-form-header">
            <h4 className="post-form-title">Create Post</h4>
        </div>
        <div className="post-form-body">
            <div className="post-form-input-body"  data-testid="input-body" onClick={()=> openPostModal()}>
                <Avatar name={profile?.username} bgColor={profile?.avatarColor} textColor="#ffffff" size={50}
                    avatarSrc={profile?.profilePicture} />
                <div className="post-form-input" data-placeholder="Write something here..."></div>
            </div>
            <hr />
            <ul className="post-form-list" data-testid="list-item">
                <li className="post-form-list-item image-select" onClick={()=> openImageModal()}>
                    <Input
                     ref={fileInputRef}  
                     name="image" 
                     type="file" 
                     className="file-input"
                     onClick={()=> {
                        if (fileInputRef.current){
                            fileInputRef.current.value = null;
                        }
                    }}
                    handleChange={handleFileChange}
                     />
                    <img src={photo} alt="" /> Photo
                </li>
                <li className="post-form-list-item" onClick={()=> openGifModal()}>
                    <img src={gif} alt="" /> Gif
                </li>
                <li className="post-form-list-item" onClick={()=> openFeelingsComponent()}>
                    <img src={feeling} alt="" /> Feeling
                </li>
            </ul>
        </div>
    </div>
  </div>
      {isOpen && type === 'add' && <AddPost selectedImage={selectedPostImage}/>   }
    </>
  )
}

export default PostForm
