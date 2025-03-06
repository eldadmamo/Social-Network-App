

export class PostUtils {
    static selectBackground(bgColor, postData, setTextAreaBackground, setPostData, setDisable){
        postData.bgColor = bgColor;
        setTextAreaBackground(bgColor);
        setPostData(postData);
        setDisable(false);
    }
}

export const postUtils = new PostUtils