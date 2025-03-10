import React, { useEffect, useState } from 'react'
import './CommentsModal.scss'
import ReactionWrapper from '../../modal-wrappers/reaction-wrapper/ReactionWrapper'
import Avatar from '../../../avatar/Avatar'
import { Utils } from '../../../../services/utils/utils.service'
import { useDispatch, useSelector } from 'react-redux'
import { postService } from '../../../../services/api/post/post.service'
import useEffectOnce from '../../../../hooks/useEffectOnce'
import { closeModal } from '../../../../redux-toolkit/reducers/model/modal.reducer'
import { clearPost } from '../../../../redux-toolkit/reducers/post/post.reducer'

const CommentsModal = () => {
    const {post} = useSelector((state) => state);
    const [postComments, setPostsComments] = useState([]);

    const dispatch = useDispatch()

    const getPostComments = async () => {
        try{
            const response = await postService.getPostComments(post?._id);
            setPostsComments(response.data?.comments);
        } catch(error){
          Utils.dispatchNotification(error.response.data.message, 'error', dispatch);  
        }
    } 

    const closeCommentsModal = () => {
        dispatch(closeModal());
        dispatch(clearPost());
    }

    useEffectOnce(()=> {
        getPostComments();
    },[]);

  return (
    <ReactionWrapper closeModal={closeCommentsModal}>
    <div className="modal-comments-header">
        <h2>Comments</h2>
    </div>
    <div className="modal-comments-container">
        <ul className="modal-comments-container-list">
            {postComments.map((data) => (
            <li className="modal-comments-container-list-item" key={data?._id} data-testid="modal-list-item">
                <div className="modal-comments-container-list-item-display">
                    <div className="user-img">
                        <Avatar name={data?.username} bgColor={data?.avatarColor} textColor="#ffffff" size={45}
                            avatarSrc={data?.profilePicture} />
                    </div>
                    <div className="modal-comments-container-list-item-display-block">
                        <div className="comment-data">
                            <h1>{data?.username}</h1>
                            <p>{data?.comment}</p>
                        </div>
                    </div>
                </div>
            </li>
            ))}
        </ul>
    </div>
</ReactionWrapper>
  )
}

export default CommentsModal
