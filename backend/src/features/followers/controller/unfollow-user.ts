import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { FollowerCache } from '@root/shared/services/redis/followe.cache';
import { followerQueue } from '@root/shared/services/queues/follower.queue';

const followerCache: FollowerCache = new FollowerCache();


export class Remove {
  public async follower(req: Request, res: Response): Promise<void> {
    const { followeeId, followerId } = req.params;
    // update count in cache
    const removeFollowerFromCache: Promise<void> = followerCache.removeFollowerFromCache(`following:${req.currentUser!.userId}`, followeeId);
    const removefolloweeFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${followeeId}`, followerId);


    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', -1);
    const addFolloweeToCache: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1);
    await Promise.all([removeFollowerFromCache, removefolloweeFromCache,followersCount,addFolloweeToCache]);

    followerQueue.addFollowerJob('removeFollowerFromDB',{
      keyOne: `${followeeId}`,
      keyTwo: `${followerId}`
    })

    res.status(HTTP_STATUS.OK).json({ message: 'Unfollow user now' });
  }

}
