import React from 'react'
import { useRef, useState } from 'react'
import './Streams.scss'
import Suggesstions from '../../../components/suggesstions/Suggesstions';
import { useDispatch } from 'react-redux';
import { getUserSuggestions } from '../../../redux-toolkit/api/suggestion';
import useEffectOnce from '../../../hooks/useEffectOnce';
import PostForm from '../../../components/posts/post-form/PostForm';
import Posts from '../../../components/posts/Posts';
import { Utils } from '../../../services/utils/utils.service';
import { postService } from '../../../services/api/post/post.service';


const Streams = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();

  const getAllPosts = async () => {
    try{
      const response = await postService.getAllPosts(1);
      if(response.data.posts.length > 0){
        setPosts(response.data.posts)
      }
      setLoading(false);
    } catch(error){
      Utils.dispatchNotification(error.response.data.message,'error', dispatch);
    }
  } 


  useEffectOnce(()=> {
    dispatch(getUserSuggestions());
    getAllPosts()
  })

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef} style={{backgroundColor: 'white'}}>
          <PostForm />
          <Posts allPosts={posts} postsLoading={loading} userFollowing={[]} />
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
