import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { FollowerCache } from '@root/shared/services/redis/followe.cache';
import { UserCache } from '@root/shared/services/redis/user.cache';
import { IUserDocument } from '@root/features/user/interfaces/user.interface';
import { IFollowerData } from '../interfaces/follower.interface';
import { socketIOFollowerObject } from '@root/shared/sockets/follower';
import { followerQueue } from '@root/shared/services/queues/follower.queue';

const followerCache: FollowerCache = new FollowerCache();
const userCache: UserCache = new UserCache();

export class AddFollow {
  public async follower(req: Request, res: Response): Promise<void> {
    const {followerId} = req.params;

    // update count in cache
    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followersCount', 1);
    const followingCount: Promise<void> = followerCache.updateFollowersCountInCache(`${req.currentUser!.userId}`, 'followingCount', 1);
    await Promise.all([followersCount, followingCount]);

    const cachedFollower: Promise<IUserDocument> = userCache.getUserFromCache(`${followerId}`) as Promise<IUserDocument>;
    const cachedFollowedUser: Promise<IUserDocument> = userCache.getUserFromCache(`${req.currentUser!.userId}`) as Promise<IUserDocument>;
    const response: [IUserDocument, IUserDocument] = await Promise.all([cachedFollower, cachedFollowedUser]);

    const followerObjectId: ObjectId = new ObjectId();
    const addFollowedUserData: IFollowerData = AddFollow.prototype.userData(response[0]);

    socketIOFollowerObject.emit('add follower', addFollowedUserData);

    const addFollowerToCache: Promise<void> = followerCache.saveFollowerToCache(`following:${req.currentUser!.userId}`, `${followerId}`);
    const addFollowedUserToCache: Promise<void> = followerCache.saveFollowerToCache(`followers:${followerId}`, `${req.currentUser!.userId}`);
    await Promise.all([addFollowerToCache, addFollowedUserToCache]);

    followerQueue.addFollowerJob('addFollowerToDB', {
        keyOne: `${req.currentUser!.userId}`,
        keyTwo: `${followerId}`,
        username: req.currentUser!.username,
        followerDocumentId: followerObjectId
    });
    res.status(HTTP_STATUS.OK).json({message: 'Following user now'});
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
      userProfile: user
    };
  }
}
