import React, { useEffect } from 'react'
import { useRef, useState } from 'react'
import './Streams.scss'
import Suggesstions from '../../../components/suggesstions/Suggesstions';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSuggestions } from '../../../redux-toolkit/api/suggestion';
import useEffectOnce from '../../../hooks/useEffectOnce';
import PostForm from '../../../components/posts/post-form/PostForm';
import Posts from '../../../components/posts/Posts';
import { Utils } from '../../../services/utils/utils.service';
import { postService } from '../../../services/api/post/post.service';
import { getPosts } from '../../../redux-toolkit/api/posts';
import { uniqBy } from 'lodash';
import useInfiniteScroll from './../../../hooks/useInfiniteScroll';
import { PostUtils } from '../../../services/utils/post-utils.service';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { addReactions } from '../../../redux-toolkit/reducers/post/user-post-reaction.reducer';


const Streams = () => {
  const {allPosts} = useSelector((state) => state);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0)
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  let appPosts = useRef([]);
  const dispatch = useDispatch();
  const storedUsername = useLocalStorage('username', 'get');
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  let PAGE_SIZE = 10;

  function fetchPostData(){
    let pageNum = currentPage;
    if(currentPage <= Math.round(totalPostsCount/ PAGE_SIZE)){
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllPosts();
    }
  }

  const getAllPosts = async () => {
    try{
      const response = await postService.getAllPosts(1);
      if(response.data.posts.length > 0){
        appPosts = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts, '_id');
        setPosts(allPosts);
      }
      setLoading(false);
    } catch(error){
      Utils.dispatchNotification(error.response.data.message,'error', dispatch);
    }
  } 

  const getReactionsByUsername = async () => {
    try{
      const response = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data.reactions));
    }catch(error){
      Utils.dispatchNotification(error.response.data.message,'error', dispatch);
    }
  }


  useEffectOnce(()=> {
    getReactionsByUsername();
  })

  useEffect(()=> {
    dispatch(getPosts());
    dispatch(getUserSuggestions());
    getAllPosts()
  },[dispatch])

  useEffect(()=> {
    setLoading(allPosts?.isLoading)
    setPosts(allPosts?.posts)
    setTotalPostsCount(allPosts?.totalPostsCount)
  },[allPosts])


  useEffect(()=> {
    PostUtils.socketIOPost(posts, setPosts);
  },[posts])

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          <Posts allPosts={posts || []} postsLoading={loading} userFollowing={following} />
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        
      </div>
    </div>
  )
}

export default Streams
