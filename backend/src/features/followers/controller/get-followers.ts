import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import HTTP_STATUS from 'http-status-codes';
import mongoose from "mongoose";
import { FollowerCache } from "@root/shared/services/redis/followe.cache";
import { IFollowerData } from "../interfaces/follower.interface";
import { followerService } from "@root/shared/services/db/follower.service";

const followerCache: FollowerCache = new FollowerCache();


export class GetFollow {
  public async userFollowing(req: Request, res: Response): Promise<void> {
    const userObjectId: ObjectId = new mongoose.Types.ObjectId(req.currentUser!.userId);
    const cacheFollowees: IFollowerData[] = await followerCache.getFollowersFromCache(`following:${req.currentUser!.userId}`);
    const following: IFollowerData[] = cacheFollowees.length ? cacheFollowees : await followerService.getFollowedUser(userObjectId);


    res.status(HTTP_STATUS.OK).json({message: 'user Following', following});
  }


  public async userFollowers(req: Request, res: Response): Promise<void> {
    const userObjectId: ObjectId = new mongoose.Types.ObjectId(req.params.userId);
    const cacheFollowers: IFollowerData[] = await followerCache.getFollowersFromCache(`followers:${req.params.userId}`);
    const followers: IFollowerData[] = cacheFollowers.length ? cacheFollowers : await followerService.getFollowerUser(userObjectId);


    res.status(HTTP_STATUS.OK).json({message: 'user Followers', followers});
  }
}
