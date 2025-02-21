import { Request, Response } from "express";
import { PostCache } from "@root/shared/services/redis/post.cache";
import HTTP_STATUS from 'http-status-codes';
import { postQueue } from "@root/shared/services/queues/post.queue";
import { SocketIOPostObject } from "@root/shared/sockets/post";
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { postSchema, postWithImageSchema } from "../schemes/post.schemes";
import { IPostDocument } from "../interfaces/post.interface";
import { UploadApiResponse } from "cloudinary";
import { BadRequestError } from "@root/shared/globals/helpers/error.handler";
import { uploads } from "@root/shared/globals/helpers/cloudinary-upload";

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

  @joiValidation(postWithImageSchema)
  public async postWithImage(req: Request, res: Response): Promise<void> {
    const {imgId, imgVersion} = req.body;
    if (imgId && imgVersion){
      Update.prototype.updatePostWithImage(req);
    } else {
      const result: UploadApiResponse = await Update.prototype.addImageToExistingPost(req);
      if(!result.public_id){
        throw new BadRequestError(result.message);
      }
    }

    res.status(HTTP_STATUS.OK).json({message: 'Post with image Updated Successfully'})
  }

  private async updatePostWithImage(req: Request) : Promise<void> {
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
  }

  private async addImageToExistingPost(req: Request) : Promise<UploadApiResponse> {
    const {post, bgColor, feelings, privacy, gifUrl, profilePicture, image} = req.body;
    const {postId} = req.params;
    const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
    if (!result?.public_id) {
      return result;
    }

    const updatedPost: IPostDocument = {
      post,
      bgColor,
      privacy,
      feelings,
      gifUrl,
      profilePicture,
      imgId: result.public_id,
      imgVersion: result.version.toString()
    } as IPostDocument;

    const postUpdate: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
    SocketIOPostObject.emit('update post', postUpdate, 'posts');
    postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdate});
    // call image queue to add image to mongofb database

    return result;
  }
}
