import { closeModal } from "../../redux-toolkit/reducers/model/modal.reducer";
import { clearPost } from "../../redux-toolkit/reducers/post/post.reducer";


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
}

export const postUtils = new PostUtils