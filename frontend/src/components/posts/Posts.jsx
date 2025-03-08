import React, { useState , useEffect} from 'react'
import PropTypes from 'prop-types'
import '../posts/Posts.scss'
import { useSelector } from 'react-redux'
import { Utils } from '../../services/utils/utils.service'
import Post from './post/Post'

const Posts = ({allPosts, userFollowing, postsLoading}) => {
    const {profile} = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [ following, setFollowing] = useState([])
    const [loading, setLoading] = useState(true); 

    
    useEffect(()=> {
        console.log(following, loading, profile);
        setPosts(allPosts);
        setFollowing(userFollowing);
        setLoading(postsLoading);
    },[allPosts, userFollowing, postsLoading])

  return (
    <div className='posts-container' data-testid="posts">
      {posts.map((post) => {
  return (
    <div key={Utils.generateString(10)} data-testid="posts-item">
      <Post post={post} showIcons={false} />
    </div>
  );
})}
    </div>
  )
}

Posts.propTypes = {
    allPosts: PropTypes.array.isRequired,
    userFollowing : PropTypes.array.isRequired,
    postsLoading : PropTypes.bool 
}

export default Posts
