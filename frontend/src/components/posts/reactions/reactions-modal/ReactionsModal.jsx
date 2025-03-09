import React, { useEffect, useState } from 'react'
import ReactionWrapper from '../../modal-wrappers/reaction-wrapper/ReactionWrapper'
import ReactionList from './reaction-list/ReactionList'
import { reactionsMap } from '../../../../services/utils/static.data';
import { Utils } from '../../../../services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '../../../../services/api/post/post.service';
import { orderBy } from 'lodash';
import useEffectOnce from '../../../../hooks/useEffectOnce';

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
            setReactionOfPost(orderedPosts)
        }catch(error){
            Utils.dispatchNotification(error.response.data.message,'error', dispatch);
        }
    };

    useEffectOnce(()=> {
        getPostReactions();
        setFormattedReactions(Utils.formattedReactions(reactions));
    },[])

  return (
    <>
      <ReactionWrapper>
        <div className='modal-reactions-header-tabs'>
            <ul className='modal-reactions-header-tabs-list'>
                <li className={`${activeViewAllTab ? 'activeViewAllTab': 'all' }`}>
                    All 
                </li>
                {formattedReactions.map((reaction, index) => (
                    <li 
                    key={index}
                    className={`${reaction.type === reactionType ? 'activeTab': ''}`}
                    style={{color: `${reaction.type === reactionType ? reactionColor: '' } `}}
                    >
                        <img src={`${reactionsMap(reaction?.type)}`} alt="" />
                        <span>{Utils.shortenLargeNumbers(reaction?.value)}</span>
                    </li>
                ))}

            </ul>
        </div>
        <div className='modal-reactions-list'>
            <ReactionList postReactions={[]}/>
        </div>
        <div>

        </div>
      </ReactionWrapper>
    </>
  )
}

export default ReactionsModal
