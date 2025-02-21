import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { Request, Response } from "express";
import HTTP_STATUS from 'http-status-codes';
import { postSchema, postWithImageSchema } from "../schemes/post.schemes";
import { ObjectId } from 'mongodb';
import { IPostDocument } from "../interfaces/post.interface";
import { PostCache } from "@root/shared/services/redis/post.cache";
import {  SocketIOPostObject } from "@root/shared/sockets/post";
import { postQueue } from "@root/shared/services/queues/post.queue";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { uploads } from "@root/shared/globals/helpers/cloudinary-upload";
import { BadRequestError } from "@root/shared/globals/helpers/error.handler";

const postCache: PostCache = new PostCache();

export class Create {
 @joiValidation(postSchema)
 public async post(req:Request, res: Response): Promise<void> {
  const {post, bgColor, privacy, gifUrl, profilePicture, feelings} = req.body;

  const postObjectId: ObjectId = new ObjectId();

  const createdPost: IPostDocument = {
    _id: postObjectId,
    userId: req.currentUser!.userId,
    username: req.currentUser!.username,
    email: req.currentUser!.email,
    avatarColor: req.currentUser!.avatarColor,
    profilePicture,
    post,
    bgColor,
    feelings,
    privacy,
    gifUrl,
    commentsCount:0,
    imgVersion: '',
    imgId: '',
    createdAt: new Date(),
    reactions: {
      like: 0,
      love: 0,
      happy: 0,
      sad: 0,
      wow: 0,
      angry:0
    }
  } as IPostDocument;

  SocketIOPostObject.emit('add post', createdPost);
  await postCache.savePostToCache({
    key: postObjectId,
    currentUserId: `${req.currentUser!.userId}`,
    uId: `${req.currentUser!.uId}`,
    createdPost
  });

  postQueue.addPostJob('addPostToDB',{ key: req.currentUser!.userId, value: createdPost});

  res.status(HTTP_STATUS.CREATED).json({message: 'Post created successfully'})
 }

 @joiValidation(postWithImageSchema)
 public async postWithimage(req:Request, res: Response): Promise<void> {
  const {post, bgColor, privacy, gifUrl, profilePicture, feelings, image} = req.body;

  const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
   if (!result?.public_id) {
    throw new BadRequestError(result.message);
  }

  const postObjectId: ObjectId = new ObjectId();
  const createdPost: IPostDocument = {
    _id: postObjectId,
    userId: req.currentUser!.userId,
    username: req.currentUser!.username,
    email: req.currentUser!.email,
    avatarColor: req.currentUser!.avatarColor,
    profilePicture,
    post,
    bgColor,
    feelings,
    privacy,
    gifUrl,
    commentsCount:0,
    imgVersion: result.version.toString(),
    imgId: result.public_id,
    createdAt: new Date(),
    reactions: {
      like: 0,
      love: 0,
      happy: 0,
      sad: 0,
      wow: 0,
      angry:0
    }
  } as IPostDocument;

  SocketIOPostObject.emit('add post', createdPost);

  await postCache.savePostToCache({
    key: postObjectId,
    currentUserId: `${req.currentUser!.userId}`,
    uId: `${req.currentUser!.uId}`,
    createdPost
  });


  postQueue.addPostJob('addPostToDB',{ key: req.currentUser!.userId, value: createdPost});
  //call image queue to add image to mongodb database

  res.status(HTTP_STATUS.CREATED).json({message: 'Post created with image successfully'})
 }

}
