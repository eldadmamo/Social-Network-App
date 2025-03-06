import React, { useState } from 'react'
import PostWrapper from '../../modal-wrappers/post-wrapper/PostWrapper'
import { useSelector } from 'react-redux'
import '../post-add/AddPost.scss'
import ModalBoxContent from '../modal-box-content/ModalBoxContent'
import { FaTimes } from 'react-icons/fa'

const AddPost = () => {
    const {gifModalIsOpen} = useSelector((state) => state.modal);
    const {loading} = useState(false);
    const [postImage] = useState('');


  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen && (
            <div 
            className='modal-box'
            >
                {loading && (
                    <div className='modal-box-loading' data-testid="modal-box-loading">
                        <span>Posting...</span>
                    </div>
                )}
                <div className='modal-box-header'>
                    <h2>Create Post</h2>
                    <button className='modal-box-header-cancel'>X</button>
                </div>
                <hr/>
                <ModalBoxContent/>

                {!postImage && (
                    <> 
                  <div className='modal-box-form' data-testid="modal-box-form">
                    <div className='main'>
                        <div className='flex-row'>
                            <div 
                            data-testid="editable"
                            name="post"
                            className='editable flex-item'
                            contentEditable={true}
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
                        className='post-input flex-item'
                        contentEditable={true}
                        data-placeholder="what's on your mind?..."
                        ></div>
                        <div className='image-display'>
                            <div className='image-delete-btn' data-testid="image-delete-btn">
                                <FaTimes/>
                            </div>
                            <img data-testid="post-image" className='post-image' src='' alt=''/>
                        </div>
                  </div>
                </>
                )}
                
            </div>
        )}
        {gifModalIsOpen && (
            <div>Gif</div>
        )}
      </PostWrapper>
    </>
  )
}

export default AddPost
