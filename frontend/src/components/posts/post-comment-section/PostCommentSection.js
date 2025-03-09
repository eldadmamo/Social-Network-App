import React from 'react'
import PropTypes from 'prop-types'
import CommentArea from '../comment-area/CommentArea'

const PostCommentSection = ({post}) => {
  return (
    <div data-testid="comment-section">
        <CommentArea post={post} />
    </div>
  )
}

PostCommentSection.propTypes = {
    post: PropTypes.object
}

export default PostCommentSection;
