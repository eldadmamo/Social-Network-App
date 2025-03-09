import React, { useEffect, useState } from 'react'
import ReactionWrapper from '../../modal-wrappers/reaction-wrapper/ReactionWrapper'
import ReactionList from './reaction-list/ReactionList'
import { reactionsMap } from '../../../../services/utils/static.data';
import { Utils } from '../../../../services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '../../../../services/api/post/post.service';
import { orderBy, some } from 'lodash';
import useEffectOnce from '../../../../hooks/useEffectOnce';
import { closeModal } from '../../../../redux-toolkit/reducers/model/modal.reducer';
import { clearPost } from '../../../../redux-toolkit/reducers/post/post.reducer';
import './ReactionsModal.scss'

const ReactionsModal = () => {
    const {_id, reactions} = useSelector((state) => state.post)
    const [activeViewAllTab, setActiveViewAllTabs] = useState(true);
    const [formattedReactions, setFormattedReactions] = useState([]);
    const [reactionType, setReactionType] = useState('')
    const [reactionColor, setReactionColor] = useState('');
    const [postReactions, setPostReactions] = useState([]);
    const [reactionOfPost, setReactionOfPost] = useState([]);
    const dispatch = useDispatch();

    const getPostReactions = async () => {
        try{
            const response = await postService.getPostReactions(_id);
            const orderedPosts = orderBy(response.data?.reactions, ['createdAt'], ['desc']);
            setPostReactions(orderedPosts);
            setReactionOfPost(orderedPosts);

        }catch(error){
            Utils.dispatchNotification(error.response.data.message,'error', dispatch);
        }
    };

    const closeReactionModal = () => {
        dispatch(closeModal()); 
        dispatch(clearPost())
    }

    const viewAll = () => {
        setActiveViewAllTabs(true);
        setReactionType('');
        setPostReactions(reactionOfPost)
    };

    const reactionList = (type) => {
        setActiveViewAllTabs(false);
        setReactionType(type);
        const exist = some(reactionOfPost, (reaction) => reaction.type === type);
        const filteredReactions = exist ? filter((reactionOfPost) => reaction.type === type) : [];
        setPostReactions(filteredReactions);
        setReactionColor(reactionColor[type]);
    }

    useEffectOnce(()=> {
        getPostReactions();
        setFormattedReactions(Utils.formattedReactions(reactions));
    },[])

  return (
    <>
      <ReactionWrapper closeModal={closeReactionModal}>
        <div className='modal-reactions-header-tabs'>
            <ul className='modal-reactions-header-tabs-list'>
                <li 
                className={`${activeViewAllTab ? 'activeViewAllTab': 'all' }`}
                onClick={viewAll}
                >
                    All 
                </li>
                {formattedReactions.map((reaction, index) => (
                    <li 
                    key={index}
                    className={`${reaction.type === reactionType ? 'activeTab': ''}`}
                    style={{color: `${reaction.type === reactionType ? reactionColor: '' } `}}
                    onClick={() => reactionList(reaction?.type)}
                    >
                        <img src={`${reactionsMap[reaction?.type]}`} alt="" />
                        <span>{Utils.shortenLargeNumbers(reaction?.value)}</span>
                    </li>
                ))}

            </ul>
        </div>
        <div className='modal-reactions-list'>
            <ReactionList postReactions={postReactions}/>
        </div>
        <div>

        </div>
      </ReactionWrapper>
    </>
  )
}

export default ReactionsModal
