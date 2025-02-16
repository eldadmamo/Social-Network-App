import { IUserDocument } from "@root/features/user/interfaces/user.interface";
import { BaseCache } from "./base.cache";

export class userCache extends BaseCache{
  constructor(){
    super('userCache');
  }

  public async saveUserToCache(key: string, userId: string, createdUser: IUserDocument): Promise<void> {
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
    } = createdUser

    const firstList: string[] = [
      '_id', `${_id}`,
      'uid', `${uId}`,
      'username', `${username}`,
      'email', `${email}`,
      'avatarColor', `${avatarColor}`,
      'createdAt', `${createdAt}`,
      'postsCount', `${postsCount}`
    ]

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

      const dataToSave: string[] = [...firstList,...secondList,...thirdList];
  }




}
