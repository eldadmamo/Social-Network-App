import { INotificationSettings, ISocialLinks, IUserDocument } from '@root/features/user/interfaces/user.interface';
import { BaseCache } from './base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@root/shared/globals/helpers/error.handler';
import { Helpers } from '@root/shared/globals/helpers/helpers';
import { RedisCommandRawReply } from '@redis/client/dist/lib/commands';

const log: Logger = config.createLogger('userCache');
type UserItem = string | ISocialLinks | INotificationSettings;
type UserCacheMultiType = string | number | Buffer | RedisCommandRawReply[] | IUserDocument | IUserDocument[];


export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social
    } = createdUser;

    const firstList: string[] = [
      '_id',
      `${_id}`,
      'uid',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`
    ];

    const secondList: string[] = [
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social)
    ];

    const thirdList: string[] = [
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'bgImageId',
      `${bgImageId}`
    ];

    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

    try {
      ('users:1');
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` });
      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try Again.');
    }
  }

  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: IUserDocument = (await this.client.HGETALL(`users:${userId}`)) as unknown as IUserDocument;
      response.createdAt = new Date(Helpers.parseJson(`${response.createdAt}`));
      response.postsCount = Helpers.parseJson(`${response.postsCount}`);
      response.blocked = Helpers.parseJson(`${response.blocked}`);
      response.blockedBy = Helpers.parseJson(`${response.blockedBy}`);
      response.notifications = Helpers.parseJson(`${response.notifications}`);
      response.social = Helpers.parseJson(`${response.social}`);
      response.followersCount = Helpers.parseJson(`${response.followersCount}`);
      response.followingCount = Helpers.parseJson(`${response.followingCount}`);
      response.bgImageId = Helpers.parseJson(`${response.bgImageId}`);
      response.bgImageVersion = Helpers.parseJson(`${response.bgImageVersion}`);
      response.profilePicture = Helpers.parseJson(`${response.profilePicture}`);

      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Error. Try Again');
    }
  }

  public async getUsersFromCache(start: number, end: number, excludedUserKey: string): Promise<IUserDocument[]> {
    try {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
        const response: string[] = await this.client.ZRANGE('user', start, end);
        response.reverse();

        const multi: ReturnType<typeof this.client.multi> = this.client.multi();

        for (const key of response) {
            if (key != excludedUserKey) {
                multi.HGETALL(`users:${key}`);
            }
        }
        const replies: UserCacheMultiType = await multi.exec() as UserCacheMultiType;
        const userReplies: IUserDocument[] = [];

        for (const reply of replies as IUserDocument[]) {
            reply.createdAt = new Date(Helpers.parseJson(`${reply.createdAt}`));
            reply.postsCount = Helpers.parseJson(`${reply.postsCount}`);
            reply.blocked = Helpers.parseJson(`${reply.blocked}`);
            reply.blockedBy = Helpers.parseJson(`${reply.blockedBy}`);
            reply.notifications = Helpers.parseJson(`${reply.notifications}`);
            reply.social = Helpers.parseJson(`${reply.social}`);
            reply.followersCount = Helpers.parseJson(`${reply.followersCount}`);
            reply.followingCount = Helpers.parseJson(`${reply.followingCount}`);
            reply.bgImageId = Helpers.parseJson(`${reply.bgImageId}`);
            reply.bgImageVersion = Helpers.parseJson(`${reply.bgImageVersion}`);
            reply.profilePicture = Helpers.parseJson(`${reply.profilePicture}`);
            reply.work = Helpers.parseJson(`${reply.work}`);
            reply.school = Helpers.parseJson(`${reply.school}`);
            reply.location = Helpers.parseJson(`${reply.location}`);
            reply.quote = Helpers.parseJson(`${reply.quote}`);

            userReplies.push(reply);
        }

        return userReplies;

    } catch (error) {
        log.error(error);
        throw new ServerError('Server error. Try again.');
    }
}


  public async updateSingleUserItemInCache(userId: string, prop: string, value: UserItem): Promise<IUserDocument | null> {
    try{
      if (!this.client.isOpen){
        await this.client.connect()
      }

      await this.client.HSET(`users:${userId}`,`${prop}`, JSON.stringify(value))
      const response: IUserDocument = await this.getUserFromCache(userId) as IUserDocument;
      return response;
    } catch(error){
      log.error(error);
      throw new ServerError('Server Error. Try Again')
    }
  }
}
