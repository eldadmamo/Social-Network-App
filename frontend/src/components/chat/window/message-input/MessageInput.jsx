import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../../../input/input'
import Button from '../../../button/Button'
import { FaPaperPlane } from 'react-icons/fa'
import gif from '../../../../assets/images/gif.png'
import photo from '../../../../assets/images/photo.png'
import feelings from '../../../../assets/images/feeling.png'
import './MessageInput.scss'
import loadable from '@loadable/component'
import GiphyContainer from '../../giphy-container/GiphyContainer'
import ImagePreview from '../../image-preview/ImagePreview'
import { ImageUtils } from './../../../../services/utils/image-utils.service';

const EmojiPickerComponent = loadable(()=> import('./EmojiPicker'), {
  fallback: <p id='loading'>Loading...</p>

})

const MessageInput = ({ setChatMessage }) => {
  const [showEmojiContainer, setShowEmojiContainer] = useState(false)
  const [showGifContainer, setShowGifContainer] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [file, setFile] = useState();


  const fileInputRef = useRef();

  const handleGiphyClick =() => {

  }

  const addToPreview = async (file) => {
    ImageUtils.checkFile(file, 'image')
    setFile(URL.createObjectURL(file));
    const result = await ImageUtils.readAsBase64(file);
    
    setShowImagePreview(!showImagePreview)
    setShowEmojiContainer(false);
    setShowGifContainer(false);
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

    return (
      <>
      {showEmojiContainer && (
        <EmojiPickerComponent
        onEmojiClick={(event, eventObject) => {
          console.log(eventObject)
        }}
        pickerStyle={{width: '352px', height: '447px'}}
        />
      )}
      {showGifContainer && 
      <GiphyContainer
      handleGiphyClick={handleGiphyClick}
    
      />
      
      }
      <div className="chat-inputarea" data-testid="chat-inputarea">
        {showImagePreview && (
          <ImagePreview 
          image={file}
          onRemoveImage={()=> {
            setFile('')
            setShowImagePreview(!showImagePreview)
          }}
          />
        )}
        <form className="chat-form">
          <ul className="chat-list" style={{borderColor: '#50b5ff'}}>
            <li className="chat-list-item"  
            onClick={()=> {
              fileInputClicked();
              setShowEmojiContainer(false)
              setShowGifContainer(false)
            }}>
              <Input 
              ref={fileInputRef} id="image" name="image" type="file" className="file-input" placeholder="Select file" 
              onClick={()=> {
                if(fileInputRef.current){
                  fileInputRef.current.value = null;
                }
              }}
              handleChange={(event) => addToPreview(event.target.files[0])}
              />
              <img src={photo} alt="" />
            </li>
            <li className="chat-list-item" 
            onClick={()=> {
              setShowGifContainer(!showGifContainer)
              setShowEmojiContainer(false)
              setShowImagePreview(false)
            }}>
              <img src={gif} alt="" />
            </li>
            <li className="chat-list-item" 
            onClick={()=> {
              setShowEmojiContainer(!showEmojiContainer)
              setShowGifContainer(false)
              setShowImagePreview(false)
            }}>
              <img src={feelings} alt="" />
            </li>
          </ul>
          <Input id="message" name="message" type="text" className="chat-input" placeholder="Enter your message..." />
          <Button label={<FaPaperPlane />} className="paper" />
        </form>
      </div>
      </>
    )
  }
  
  MessageInput.propTypes = {
    setChatMessage: PropTypes.func,
  }
  
  export default MessageInput