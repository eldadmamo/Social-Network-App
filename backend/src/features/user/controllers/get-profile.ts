import { Request,Response } from "express";
import  HTTP_STATUS  from 'http-status-codes';
import { PostCache } from "@service/redis/post.cache";
import { UserCache } from '@root/shared/services/redis/user.cache';
import { FollowerCache } from '@root/shared/services/redis/followe.cache';
import { IAllUsers, IUserDocument } from "@user/interfaces/user.interface";
import { userService } from "@service/db/user.service";
import { IFollowerData } from "@follower/interfaces/follower.interface";
import { followerService } from "@service/db/follower.service";
import mongoose from "mongoose";

const postCache: PostCache = new PostCache();
const userCache: UserCache = new UserCache();
const followerCache: FollowerCache = new FollowerCache();

const PAGE_SIZE = 12;

interface IUserAll {
  newSkip: number;
  limit: number;
  skip: number;
  userId: string;
}

export class GetUser {
  public async all(req: Request, res: Response): Promise<void> {
    const {page} = req.params;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE * parseInt(page);
    const newSkip: number = skip === 0 ? skip : skip + 1;
    const allUsers = await GetUser.prototype.allUsers({
      newSkip,
      limit,
      skip,
      userId: `${req.currentUser?.userId}`
    })
    const followers: IFollowerData[] = await GetUser.prototype.followers(`${req.currentUser!.userId}`);
    res.status(HTTP_STATUS.OK).json({message: 'Get Users', users: allUsers.users, totalUsers: allUsers.totalUsers, followers})
  }

  private async allUsers({newSkip, limit, skip, userId}: IUserAll): Promise<IAllUsers> {
    let users;
    let type = '';
    const cachedUsers: IUserDocument[] = await userCache.getUsersFromCache(newSkip, limit, userId) as IUserDocument[];

    if(cachedUsers.length){
      type = 'redis';
      users = cachedUsers;
    } else {
      type = 'mongodb';
      users = await userService.getAllUsers(userId, skip, limit);
    }
    const totalUsers: number = await GetUser.prototype.usersCount(type);
    return {users, totalUsers};
  }

  private async usersCount(type: string): Promise<number> {
    return 0;
  }

  private async followers(userId: string): Promise<IFollowerData[]> {
    const cachedFollowers: IFollowerData[] = await followerCache.getFollowersFromCache(`followers:${userId}`);
    const result = cachedFollowers.length ? cachedFollowers : await followerService.getFollowedUser(new mongoose.Types.ObjectId(userId))
    return result;
  }
}
