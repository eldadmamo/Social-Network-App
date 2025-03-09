import React, { useCallback, useEffect, useState } from 'react'
import { FaRegCommentAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './CommentArea.scss'
import Reactions from '../reactions/Reactions';
import { cloneDeep, find } from 'lodash';
import { Utils } from '../../../services/utils/utils.service';
import { reactionsMap } from '../../../services/utils/static.data';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '../../../services/api/post/post.service';


const CommentArea = ({ post }) => {
    const {profile} = useSelector((state) => state.user);
    const {reactions} = useSelector((state) => state.userPostReactions);
    const [userSelectedReaction, setUserSelectedReaction] = useState('')
    const dispatch = useDispatch();

    const selectedUserReaction = useCallback((postReactions)=> {
        const userReaction = find(postReactions, (reaction) => reaction.postId === post._id);
        const result = userReaction ? Utils.firstLetterUpperCase(userReaction.type) : '';
        setUserSelectedReaction(result);
    },[post]);

    useEffect(()=> {
        selectedUserReaction(reactions);
    },[selectedUserReaction, reactions])

    const addReactionPost = async (reaction) => {
        try{
            const reactionResponse = await postService.getSinglePostReactionByUsername(post?._id, profile?.username);
            post = updatePostReaction(
                reaction,
                Object.keys(reactionResponse.data.reactions).length,
                reactionResponse.data.reactions?.type  
            )

        }catch(error){
            Utils.dispatchNotification(error?.response.data?.message, 'error', dispatch)
        }
    };

    const updatePostReaction = (newReaction, hasResponse, previousReaction) => {
        post = cloneDeep(post);
        if(!hasResponse){
            post.reactions[newReaction] += 1;
        } else {
            if (post.reactions[previousReaction] > 0){
                post.reactions[previousReaction] -= 1;
            }
            if(previousReaction !== newReaction){
                post.reactions[newReaction] += 1;   
            }
        }
        return post;
    }


  return (
    <>
    <div className="comment-area" data-testid="comment-area">
    <div className="like-icon reactions">
        <div className="likes-block" onClick={()=> addReactionPost('like')}>
            <div className={`likes-block-icons reaction-icon ${userSelectedReaction.toLowerCase()}`}>
                {userSelectedReaction && (
                <div className={`reaction-display ${userSelectedReaction.toLowerCase()}`}
                    data-testid="selected-reaction">
                    <img className="reaction-img" src={reactionsMap[userSelectedReaction.toLowerCase()]} alt="" />
                    <span>{userSelectedReaction}</span>
                </div>
                )}
                
               {!userSelectedReaction && (
                <div className="reaction-display" data-testid="default-reaction">
                   <img className="reaction-img" src={`${reactionsMap.like}`} alt="" /> <span>Like</span>
                </div> 
               )}
            </div>
        </div>
        <div className="reactions-container app-reactions">
            <Reactions handleClick={addReactionPost}  />
        </div>
    </div>
    <div className="comment-block" >
        <span className="comments-text">
            <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
        </span>
    </div>
</div>
    </>
  )
}

CommentArea.propTypes ={
    post: PropTypes.object
}

export default CommentArea