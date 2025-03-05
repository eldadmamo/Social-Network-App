import React from 'react'
import './Streams.scss'
import SuggestionsSkeletons from '../../../components/suggesstions/SuggestionsSkeleton';

const StreamsSkeleton = () => {
  

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" >
          <div>Post Form</div>
          {[1,2,3,4,5].map((index) => (
            <div key={index}>
                Posts Items
            </div>
          ))}
        </div>
        <div className="streams-suggestions">
          <SuggestionsSkeletons />
        </div>
      </div>
    </div>
  )
}

export default StreamsSkeleton;
