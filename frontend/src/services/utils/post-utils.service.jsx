import { closeModal } from "../../redux-toolkit/reducers/model/modal.reducer";
import { clearPost, updatePostItem } from "../../redux-toolkit/reducers/post/post.reducer";


export class PostUtils {
    static selectBackground(bgColor, postData, setTextAreaBackground, setPostData, setDisable){
        postData.bgColor = bgColor;
        setTextAreaBackground(bgColor);
        setPostData(postData);
        setDisable(false);
    }

    static postInputEditable(textContent,postData, setPostData, setDisable){
        postData.post = textContent;
        setPostData(postData);
        setDisable(false);   
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
        setDisable,
        setPostData 
    ){
        postData.gifUrl = '';
        postData.image = '';
        setSelectedPostImage(null);
        setPostImage('');
        setDisable(false);
        setTimeout(()=> {
            if (inputRef?.current){
                inputRef.current.textContent = !post ? postData?.post : post;
                if (post) {
                    postData.post = post;
                }
                setPostData(postData);
            }
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
            }
        })
    }
}

export const postUtils = new PostUtils