import React, { useState , useEffect} from 'react'
import PropTypes from 'prop-types'
import '../posts/Posts.scss'
import { useSelector } from 'react-redux'
import { Utils } from '../../services/utils/utils.service'
import Post from './post/Post'
import { PostUtils } from '../../services/utils/post-utils.service'


const Posts = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading]);

  return (
    <div className="posts-container" data-testid="posts">
      {
        posts.map((post) => (
          <div key={post?._id} data-testid="posts-item">
            {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
              <>
                {PostUtils.checkPrivacy(post, profile, following) && (
                  <>
                    <Post post={post} showIcons={false} />
                  </>
                )}
              </>
            )}
          </div>
        ))}

      
    </div>
  );
};
Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool
};
export default Posts;

