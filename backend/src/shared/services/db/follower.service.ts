import mongoose, {Query} from "mongoose";
import { BulkWriteResult, ObjectId } from 'mongodb'
import { FollowerModel } from "@root/features/followers/models/follower.schema";
import { UserModel } from '@root/features/user/models/user.schema';
import { IQueryComplete, IQueryDeleted } from "@root/features/post/interfaces/post.interface";
import { IFollowerData, IFollowerDocument } from "@root/features/followers/interfaces/follower.interface";
import { IUserDocument } from "@root/features/user/interfaces/user.interface";
import { INotificationDocument, INotificationTemplate } from './../../../features/notifications/interfaces/notification.interface';
import { NotificationModel } from "@root/features/notifications/models/notification.schema";
import { socketIONotificationObject } from "@root/shared/sockets/notification";
import { notificationTemplate } from "../emails/templates/notifications/notification-template";
import { emailQueue } from "../queues/email.queue";
import { UserCache } from "../redis/user.cache";

const userCache: UserCache = new UserCache();

class FollowerService {
  public async addFollowerToDB(userId: string, followeeId: string, username: string, followerDocumentId: ObjectId): Promise<void> {
    const followeeObjectId: ObjectId = new mongoose.Types.ObjectId(followeeId);
    const followerObjectId: ObjectId = new mongoose.Types.ObjectId(userId);

    const following = await FollowerModel.create({
      _id: followerDocumentId,
      followeeId: followeeObjectId,
      followerId: followerObjectId
    });
    const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
      {
        updateOne: {
          filter: {_id: userId},
          update: {$inc: {followingCount: 1}}
        }
      },
      {
        updateOne: {
          filter: {_id: followeeId},
          update: {$inc: {followersCount: 1}}
        }
      }
    ]);
    const response: [BulkWriteResult, IUserDocument | null] = await Promise.all([users, userCache.getUserFromCache(followeeId)])

    if(response[1]?.notifications.follows && userId !== followeeId) {
      const notificationModel: INotificationDocument = new NotificationModel();
      const notifications = await notificationModel.insertNotification({
        userFrom: userId,
        userTo:followeeId,
        message: `${username} is now following you.`,
        notificationType: 'follows',
        entityId: new mongoose.Types.ObjectId(userId),
        createdItemId: new mongoose.Types.ObjectId(following._id),
        createdAt: new Date(),
        comment: '',
        post: '',
        imgId: '',
        imgVersion: '',
        gifUrl: '',
        reaction: ''
      });
      // send to client
      socketIONotificationObject.emit('insert notification', notifications, {userTo: followeeId});
      const templateParams: INotificationTemplate = {
        username: response[1].username!,
        message: `${username} is now following you.`,
        header: 'Follower Notification'
      }
      const template: string = notificationTemplate.notificationMessageTemplate(templateParams);
      console.log(response[1])
      emailQueue.addEmailJob('followersEmail', {receiverEmail: response[1].email!, template, subject: 'Post Notificaion'})

      // send to email
    }
  }


  public async removeFollowerToDB(followeeId: string, followerId: string): Promise<void> {
    const followeeObjectId: ObjectId = new mongoose.Types.ObjectId(followeeId);
    const followerObjectId: ObjectId = new mongoose.Types.ObjectId(followerId);

    const unfollow: Query<IQueryComplete & IQueryDeleted, IFollowerDocument> =  FollowerModel.deleteOne({
      followeeId: followeeObjectId,
      followerId: followerObjectId
    });
    const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
      {
        updateOne: {
          filter: {_id: followerId},
          update: {$inc: {followingCount: -1}}
        }
      },
      {
        updateOne: {
          filter: {_id: followeeId},
          update: {$inc: {followersCount: -1}}
        }
      }
    ]);
    await Promise.all([unfollow, users])


  }

  public async getFolloweeData(userObjectId: ObjectId): Promise<IFollowerData[]> {
    const followee:IFollowerData[] = await FollowerModel.aggregate([
      {$match: {followerId: userObjectId}},
      {$lookup: {from: 'User', localField: 'followeeId', foreignField: '_id', as: 'followeeId'}},
      {$unwind: '$followeeId'},
      {$lookup: {from: 'Auth', localField: 'followeeId.authId', foreignField: '_id', as: 'authId'}},
      {$unwind: '$authId'},
      {
        $addFields: {
          _id: '$followeeId._id',
          username: '$authId.username',
          avatarColor: '$authId.avatarColor',
          uId: '$authId.uId',
          postCount: '$followeeId.postsCount',
          followersCount: '$followeeId.followersCount',
          followingCount: '$followeeId.followingCount',
          profilePicture: '$followeeId.profilePicture',
          userProfile: '$followeeId'
        }
      },
      {
        $project: {
          authId: 0,
          followerId: 0,
          followeeId: 0,
          createdAt: 0,
          __v: 0
        }
      }
    ]);

    return followee;
  }

  public async getFollowerData(userObjectId: ObjectId): Promise<IFollowerData[]> {
    const follower:IFollowerData[] = await FollowerModel.aggregate([
      {$match: {followeeId: userObjectId}},
      {$lookup: {from: 'User', localField: 'followerId', foreignField: '_id', as: 'followerId'}},
      {$unwind: '$followerId'},
      {$lookup: {from: 'Auth', localField: 'followerId.authId', foreignField: '_id', as: 'authId'}},
      {$unwind: '$authId'},
      {
        $addFields: {
          _id: '$followerId._id',
          username: '$authId.username',
          avatarColor: '$authId.avatarColor',
          uId: '$authId.uId',
          postCount: '$followerId.postsCount',
          followersCount: '$followerId.followersCount',
          followingCount: '$followerId.followingCount',
          profilePicture: '$followerId.profilePicture',
          userProfile: '$followerId'
        }
      },
      {
        $project: {
          authId: 0,
          followerId: 0,
          followeeId: 0,
          createdAt: 0,
          __v: 0
        }
      }
    ]);

    return follower;
  }

}




export const followerService: FollowerService = new FollowerService();
