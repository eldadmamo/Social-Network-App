import { Request, Response } from "express";
import { PostCache } from "@root/shared/services/redis/post.cache";
import HTTP_STATUS from 'http-status-codes';
import { postQueue } from "@root/shared/services/queues/post.queue";
import { SocketIOPostObject } from "@root/shared/sockets/post";
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { postSchema } from "../schemes/post.schemes";
import { IPostDocument } from "../interfaces/post.interface";



const postCache: PostCache = new PostCache();


export class Update {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const {post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture} = req.body;
    const {postId} = req.params;
    const updatedPost: IPostDocument = {
      post,
      bgColor,
      privacy,
      feelings,
      gifUrl,
      profilePicture,
      imgId,
      imgVersion
    } as IPostDocument;


    const postUpdate: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
    SocketIOPostObject.emit('update post', postUpdate, 'posts');
    postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdate});
    res.status(HTTP_STATUS.OK).json({message: 'Post Updated Successfully'})
  }
}
