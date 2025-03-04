import React from 'react'
import { useRef } from 'react'
import './Streams.scss'

const Streams = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef} style={{backgroundColor: 'white'}}>
          <div>User Form</div>
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        <div className="streams-suggestions">
          <div>Suggession</div>
        </div>
      </div>
    </div>
  )
}

export default Streams
