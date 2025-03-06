import React from 'react'
import { useRef } from 'react'
import './Streams.scss'
import Suggesstions from '../../../components/suggesstions/Suggesstions';
import { useDispatch } from 'react-redux';
import { getUserSuggestions } from '../../../redux-toolkit/api/suggestion';
import useEffectOnce from '../../../hooks/useEffectOnce';


const Streams = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();

  useEffectOnce(()=> {
    dispatch(getUserSuggestions())
  })

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef} style={{backgroundColor: 'white'}}>
          <div>User Form</div>
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        <div className="streams-suggestions">
          <Suggesstions/>
        </div>
      </div>
    </div>
  )
}

export default Streams
