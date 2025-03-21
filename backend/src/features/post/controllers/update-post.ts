import { Request, Response } from "express";
import { PostCache } from "@root/shared/services/redis/post.cache";
import HTTP_STATUS from 'http-status-codes';
import { postQueue } from "@root/shared/services/queues/post.queue";
import { SocketIOPostObject } from "@root/shared/sockets/post";
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { postSchema, postWithImageSchema, postWithVideoSchema } from "../schemes/post.schemes";
import { IPostDocument } from "../interfaces/post.interface";
import { UploadApiResponse } from "cloudinary";
import { BadRequestError } from "@root/shared/globals/helpers/error.handler";
import { uploads , videoUpload } from "@root/shared/globals/helpers/cloudinary-upload";
import { imageQueue } from "@root/shared/services/queues/image.queue";

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
      imgVersion,
      videoId: '',
      videoVersion: ''
    } as IPostDocument;


    const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
    SocketIOPostObject.emit('update post', postUpdated, 'posts');
    postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});
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

  @joiValidation(postWithVideoSchema)
  public async postWithVideo(req: Request, res: Response): Promise<void> {
    const { videoId, videoVersion } = req.body;
    if (videoId && videoVersion) {
      Update.prototype.updatePostWithImage(req);
    } else {
      const result: UploadApiResponse = await Update.prototype.addImageToExistingPost(req);
      if (!result.public_id) {
        throw new BadRequestError(result.message);
      }
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Post with video updated successfully' });
  }

  private async updatePostWithImage(req: Request) : Promise<void> {
    const {post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture,videoId, videoVersion} = req.body;
    const {postId} = req.params;
    const updatedPost: IPostDocument = {
      post,
      bgColor,
      privacy,
      feelings,
      gifUrl,
      profilePicture,
      imgId: imgId ? imgId : '',
      imgVersion: imgVersion ? imgVersion : '',
      videoId: videoId ? videoId : '',
      videoVersion: videoVersion ? videoVersion : ''
    } as IPostDocument;

    const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
    SocketIOPostObject.emit('update post', postUpdated, 'posts');
    postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});
  }

  private async addImageToExistingPost(req: Request) : Promise<UploadApiResponse> {
    const {post, bgColor, feelings, privacy, gifUrl, profilePicture, image, video} = req.body;
    const {postId} = req.params;
    const result: UploadApiResponse = image
      ? ((await uploads(image)) as UploadApiResponse)
      : ((await videoUpload(video)) as UploadApiResponse);
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
      imgId: image ? result.public_id : '',
      imgVersion: image ? result.version.toString() : '',
      videoId: video ? result.public_id : '',
      videoVersion: video ? result.version.toString() : ''
    } as IPostDocument;

    const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
    SocketIOPostObject.emit('update post', postUpdated, 'posts');
    postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});
    // call image queue to add image to mongofb database
    if(image){
      imageQueue.addImageJob('addImageToDB', {
        key: `${req.currentUser!.userId}`,
        imgId: result.public_id,
        imgVersion: result.version.toString()
    })
    }

    return result;
  }
}
