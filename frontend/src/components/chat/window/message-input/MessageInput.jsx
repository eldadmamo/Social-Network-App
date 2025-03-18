import React, { useState } from 'react'
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

const EmojiPickerComponent = loadable(()=> import('./EmojiPicker'), {
  fallback: <p id='loading'>Loading...</p>
})

const MessageInput = ({ setChatMessage }) => {
  const [showEmojiContainer, setShowEmojiContainer] = useState(false)
  const [showGifContainer, setShowGifContainer] = useState(false);

  const handleGiphyClick =() => {

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
      {!showGifContainer && 
      <GiphyContainer
      handleGiphyClick={handleGiphyClick}
    
      />
      
      }
      <div className="chat-inputarea" data-testid="chat-inputarea">
        <form className="chat-form">
          <ul className="chat-list" style={{borderColor: '#50b5ff'}}>
            <li className="chat-list-item"  onClick={()=> {
              setShowEmojiContainer(false)
              setShowGifContainer(false)
            }}>
              <Input id="image" name="image" type="file" className="file-input" placeholder="Select file" />
              <img src={photo} alt="Photo" />
            </li>
            <li className="chat-list-item" 
            onClick={()=> {
              setShowEmojiContainer(false)
              setShowGifContainer(!showEmojiContainer)
            }}>
              <img src={gif} alt="GIF" />
            </li>
            <li className="chat-list-item" 
            onClick={()=> {
              setShowGifContainer(false)
              setShowEmojiContainer(!showEmojiContainer)
            }}>
              <img src={feelings} alt="Feelings" />
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