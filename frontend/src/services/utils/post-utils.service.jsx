import { closeModal } from "../../redux-toolkit/reducers/model/modal.reducer";
import { clearPost, updatePostItem } from "../../redux-toolkit/reducers/post/post.reducer";
import { postService } from "../api/post/post.service"; 
import { Utils } from './utils.service';


export class PostUtils {
    static selectBackground(bgColor, postData, setTextAreaBackground, setPostData){
        postData.bgColor = bgColor;
        setTextAreaBackground(bgColor);
        setPostData(postData);
    }

    static postInputEditable(textContent,postData, setPostData){
        postData.post = textContent;
        setPostData(postData);  
    }

    static closePostModal(dispatch){
        dispatch(closeModal());
        dispatch(clearPost())
    }

    static clearImage(
        postData,
        post,
        inputRef,
        dispatch,
        setSelectedPostImage,
        setPostImage,
        setPostData 
    ){
        postData.gifUrl = '';
        postData.image = '';
        setSelectedPostImage(null);
        setPostImage('');
        setTimeout(()=> {
            if (inputRef?.current){
                inputRef.current.textContent = !post ? postData?.post : post;
                if (post) {
                    postData.post = post;
                }
                setPostData(postData);
            }
            PostUtils.positionCursor('editable')
        });
        dispatch(updatePostItem({gifUrl: '', image: '', imgId: '', imgVersion: ''}));
    }

    static postInputData(imageInputRef, postData, post, setPostData){
        setTimeout(()=> {
            if (imageInputRef?.current){
                imageInputRef.current.textContent = !post ? postData?.post : post;
                if (post) {
                    postData.post = post;
                }
                setPostData(postData);
                PostUtils.positionCursor('editable')
            }
        })
    }

    static dispatchNotification(message, type, setApiResponse, setLoading, dispatch){
        setApiResponse(type);
        setLoading(false);
        Utils.dispatchNotification(message, type, dispatch);
    }

    static async sendPostWithImageRequest(
        fileResult,
        postData,
        imageInputRef,
        setApiResponse,
        setLoading,
        setDisable,
        dispatch
    ){
        try{
            postData.image = fileResult;
            if(imageInputRef?.current){
                imageInputRef.current.textContent = postData.post;
            }
            const response = await postService.createPostWithImage(postData);
            if(response){
                setApiResponse('success');
                setLoading(false);
            }
        } catch(error){
            PostUtils.dispatchNotification(
                error.response.data.message,
                'error',
                setApiResponse,
                setLoading,
                setDisable,
                dispatch
            );
        }
    }

    static checkPrivacy(post, profile, following) {
        const isPrivate = post?.privacy === 'Private' && post?.userId === profile?._id;
        const isPublic = post?.privacy === 'Public';
        const isFollower =
          post?.privacy === 'Followers' && Utils.checkIfUserIsFollowed(following, post?.userId, profile?._id);
        return isPrivate || isPublic || isFollower;
    }

    static positionCursor(elementId) {
        const element = document.getElementById(`${elementId}`);
        const selection = window.getSelection();
        const range = document.createRange();
        selection.removeAllRanges();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.addRange(range);
        element.focus();
      }

}

export const postUtils = new PostUtils