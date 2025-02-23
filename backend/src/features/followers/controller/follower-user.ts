import { Request,Response } from "express";
import mongoose from "mongoose";
import HTTP_STATUS  from 'http-status-codes';
import { FollowerCache } from "@root/shared/services/redis/followe.cache";
import { UserCache } from './../../../shared/services/redis/user.cache';
import { IUserDocument } from "@root/features/user/interfaces/user.interface";
import { IFollowerData } from "../interfaces/follower.interface";
import { ObjectId } from 'mongodb';


const followerCache: FollowerCache = new FollowerCache();
const userCache: UserCache = new UserCache();

export class Add{
  public async follower(req: Request, res: Response): Promise<void> {
    const {followerId} = req.params;

    const followersCount: Promise<void> = followerCache.updateFollowerFromCache(`${followerId}`, 'followersCount', 1);
    const followeeCount: Promise<void> = followerCache.updateFollowerFromCache(`${req.currentUser!.userId}`, 'followingCount', 1);
    await Promise.all([followersCount, followeeCount]);

    const cachedFollower: Promise<IUserDocument> = userCache.getUserFromCache(followerId) as Promise<IUserDocument>;
    const cachedFollowee: Promise<IUserDocument> = userCache.getUserFromCache(`${req.currentUser!.userId}`) as Promise<IUserDocument>;
    const response: [IUserDocument, IUserDocument] = await Promise.all([cachedFollower,cachedFollowee])

    const followerObjectId: ObjectId = new ObjectId();
    const addFolloweeData: IFollowerData = Add.prototype.userData(response[0]);


    const addFollowerToCache: Promise<void> = followerCache.saveFollowerToCache(`followers:${req.currentUser!.userId}`, `${followerId}`);
    const addFolloweeToCache: Promise<void> = followerCache.saveFollowerToCache(`followers:${followerId}`, `${req.currentUser!.userId}`);
    await Promise.all([addFollowerToCache, addFolloweeToCache])


    res.status(HTTP_STATUS.OK).json({message: 'Following user now'})
  }


  private userData(user: IUserDocument): IFollowerData {
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      username: user.username!,
      avatarColor: user.avatarColor!,
      postCount: user.postsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      profilePicture: user.profilePicture,
      uId: user.uId!,
      userProfile: user,
    }
  }
}


