import React, { useRef, useState } from 'react'
import PostWrapper from '../../modal-wrappers/post-wrapper/PostWrapper'
import { useDispatch, useSelector } from 'react-redux'
import '../post-add/AddPost.scss'
import ModalBoxContent from '../modal-box-content/ModalBoxContent'
import { FaArrowLeft, FaTimes } from 'react-icons/fa'
import { bgColors } from '../../../../services/utils/static.data'
import Button from '../../../button/Button'
import ModalBoxSelection from './../modal-box-content/modalBoxSelection'
import { PostUtils } from '../../../../services/utils/post-utils.service'
import { useEffect } from 'react';
import { closeModal, toggleGifModal } from '../../../../redux-toolkit/reducers/model/modal.reducer'
import Giphy from '../../../giphy/Giphy'
import PropTypes from 'prop-types';
import { ImageUtils } from '../../../../services/utils/image-utils.service'
import { postService } from '../../../../services/api/post/post.service' 
import Spinner from '../../../spinner/Spinner'

const AddPost = ({selectedImage}) => {
    const {gifModalIsOpen, feeling} = useSelector((state) => state.modal);
    const {gifUrl, image, privacy} = useSelector((state) => state.post);
    const {profile} = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [postImage, setPostImage] = useState('');
    const [allowedNumberOfCharacters] = useState('100/100');
    const [textAreaBackground, setTextAreaBackground] = useState('#ffffff');
    const [selectedPostImage, setSelectedPostImage] = useState();
    const [postData, setPostData] = useState({
        post:'',
        bgColor: textAreaBackground,
        privacy: '',
        feelings: '',
        gifUrl: '',
        profilePicture: '',
        image: ''
    });
    const [disable, setDisable] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const counterRef = useRef(null);
    const inputRef = useRef(null);
    const imageInputRef = useRef(null);
    const dispatch = useDispatch();

    const maxNumberOfCharacters = 100;

    const selectBackground = (bgColor) => {
        console.log(selectedImage);
        PostUtils.selectBackground(bgColor, postData, setTextAreaBackground, setPostData, setDisable);
    };

    const postInputEditable = (event, textContent) => {
        const currentTextLength = event.target.textContent.length;
        const counter =  maxNumberOfCharacters - currentTextLength;
        counterRef.current.textContent = `${counter}/100`;
        PostUtils.postInputEditable(textContent, postData, setPostData, setDisable);
    }

    const closePostModal = () => {
        PostUtils.closePostModal(dispatch)
    }

    const onKeyDown = (event) => {
        const currentTextLength = event.target.textContent.length;
        if (currentTextLength === maxNumberOfCharacters && event.keyCode !== 0){
            event.preventDefault();
        }
    }

    const clearImage = () => {
        PostUtils.clearImage(postData, '',inputRef, dispatch, setSelectedPostImage, setPostImage, setDisable, setPostData );
    }

    const createPost = async () => {
        setLoading(!loading);
        setDisable(!disable);
        try{
            if(Object.keys(feeling).length) {
                postData.feelings = feeling?.name;
            }
            postData.privacy = privacy || 'Public';
            postData.gifUrl = gifUrl;
            postData.profilePicture = profile?.profilePicture;
            if(selectedPostImage || selectedImage){
                let result = '';
                if(selectedPostImage){
                    result = await ImageUtils.readAsBase64(selectedPostImage);
                }
                if(selectedImage){
                    result = await ImageUtils.readAsBase64(selectedImage);
                }
                const response = await PostUtils.sendPostWithImageRequest(
                    result,
                    postData,
                    imageInputRef,
                    setApiResponse,
                    setLoading,
                    setDisable,
                    dispatch
                );
                if( response && response?.data?.message){
                    PostUtils.closePostModal(dispatch);
                }
            } else {
                const response = await postService.createPost(postData);
                if (response){
                    setApiResponse('success')
                    setLoading(false);
                    PostUtils.closePostModal(dispatch);
                }
            }
        }catch(error){
            PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
        }
    }

    useEffect(()=> {
        if (!loading && apiResponse === 'success'){
            dispatch(closeModal())
        }
    },[loading, dispatch, apiResponse])

    useEffect(()=> {
        if(gifUrl){
            setPostImage(gifUrl)
            PostUtils.postInputData(imageInputRef, postData, '', setPostData);
        } else if(image) {
            setPostImage(image);
            PostUtils.postInputData(imageInputRef, postData, '', setPostData);
        }
    },[gifUrl, image,postData])



  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen && (
            <div 
            className='modal-box'
            style={{
                height: selectedPostImage | gifUrl || image || postData?.gifUrl || postData?.image ? '700px': 'auto'
            }}
            >
                {loading && (
                    <div className='modal-box-loading' data-testid="modal-box-loading">
                        <span>Posting...</span>
                        <Spinner/>
                    </div>
                )}
                <div className='modal-box-header'>
                    <h2>Create Post</h2>
                    <button onClick={()=> closePostModal()} className='modal-box-header-cancel'>X</button>
                </div>
                <hr/>
                <ModalBoxContent/>

                {!postImage && (
                    <> 
                  <div 
                  className='modal-box-form' 
                  data-testid="modal-box-form" 
                  style={{background: `${textAreaBackground}`}}>

                    <div className='main' style={{margin: textAreaBackground !== '#ffffff'? '0 auto':''}}>
                        <div className='flex-row'>
                            <div 
                            data-testid="editable"
                            name="post"
                            ref={(el) => {
                                inputRef.current = el;
                                inputRef?.current?.focus();
                            }}
                            className={`editable flex-item ${textAreaBackground !== '#ffffff'? 'textInputColor':''}`}
                            contentEditable={true}
                            onInput={(e)=> postInputEditable(e, e.currentTarget.textContent)}
                            onKeyDown={onKeyDown}
                            data-placeholder="what's on your mind?..."
                            >

                            </div>
                        </div>
                    </div>
                  </div>
                </>
                )}

                {postImage && (
                    <> 
                  <div className='modal-box-image-form'>
                      <div 
                        data-testid="post-editable"
                        name="post"
                        ref={(el) => {
                            imageInputRef.current = el;
                            imageInputRef?.current?.focus();
                        }}
                        className='post-input flex-item'
                        contentEditable={true}
                        onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
                        onKeyDown={onKeyDown}
                        data-placeholder="what's on your mind?..." 
                        ></div>
                        <div className='image-display'>
                            <div className='image-delete-btn' data-testid="image-delete-btn" 
                            onClick={()=> clearImage()}
                            >
                                <FaTimes/>
                            </div>
                            <img data-testid="post-image" className='post-image' src={`${postImage}`} alt=''/>
                        </div>
                  </div>
                </>
                )}

                <div className='modal-box-bg-colors'>
                    <ul>
                        {bgColors.map((color, index) => (
                            <li
                            data-testid="bg-colors"
                            key={index}
                            className={`${color === '#ffffff' ? 'whiteColorBorder': ''}`}
                            style={{ backgroundColor: `${color}`}}
                            onClick={()=> selectBackground(color)}
                            ></li>
                        ))}
                    </ul>
                </div>
                <span className='char_count' data-testid="allowed-number" ref={counterRef}>
                    {allowedNumberOfCharacters}
                </span>

                <ModalBoxSelection setSelectedPostImage={setSelectedPostImage}/>

                <div className='modal-box-button' data-testid="post-button">
                    <Button label="Create Post" className="post-button"  disabled={disable} handleClick={createPost}/>
                </div>
            </div>

        )}
        {gifModalIsOpen && (
           <div className='modal-giphy' data-testid="modal-giphy">
            <div className='modal-giphy-header'>
                <Button 
                label={<FaArrowLeft/>}
                className="back-button"
                disabled={false}
                handleClick={()=> dispatch(toggleGifModal(!gifModalIsOpen))}
                />
                <h2>Choose a GIF</h2>
            </div>
            <hr />
            <Giphy />
           </div>
        )}
      </PostWrapper>
    </>
  )
}

AddPost.propTypes = {
    selectedImage: PropTypes.string   
}

export default AddPost
