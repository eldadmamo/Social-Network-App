import { ICommentDocument, ICommentJob, ICommentNameList, IQueryComment } from "@root/features/comment/interfaces/comment.interface";
import { IPostDocument } from "@root/features/post/interfaces/post.interface";
import { PostModel } from "@root/features/post/models/post.schema";
import mongoose,{ Query } from "mongoose";
import { UserCache } from "../redis/user.cache";
import { IUserDocument } from "@root/features/user/interfaces/user.interface";
import { NotificationModel } from '@root/features/notifications/models/notification.schema';
import { INotificationDocument, INotificationTemplate } from "@root/features/notifications/interfaces/notification.interface";
import { socketIONotificationObject } from "@root/shared/sockets/notification";
import { notificationTemplate } from "../emails/templates/notifications/notification-template";
import { emailQueue } from "../queues/email.queue";
import { CommentsModel } from "@root/features/comment/models/comment.schema";


const userCache: UserCache = new UserCache();

class CommentService {
  public async addCommentToDB(commentData: ICommentJob): Promise<void> {
    const {postId, userTo, userFrom, comment, username} = commentData;
    const comments: Promise<ICommentDocument> = CommentsModel.create(comment);
    const post: Query<IPostDocument, IPostDocument> = PostModel.findOneAndUpdate(
        {_id: postId},
        {$inc: {commentsCount: 1}},
        {new: true}
    ) as Query<IPostDocument, IPostDocument>;
    const user: Promise<IUserDocument> = userCache.getUserFromCache(userTo) as Promise<IUserDocument>;
    const response: [ICommentDocument, IPostDocument, IUserDocument] = await Promise.all([comments, post, user]);

    if (response[2].notifications.comments && userFrom !== userTo) {
        const notificationModel: INotificationDocument = new NotificationModel();
        const notifications = await notificationModel.insertNotification({
            userFrom,
            userTo,
            message: `${username} commented on your post`,
            notificationType: 'comment',
            entityId: new mongoose.Types.ObjectId(postId),
            createdItemId: new mongoose.Types.ObjectId(response[0]._id),
            createdAt: new Date(),
            comment: comment.comment,
            post: response[1].post,
            imgId: response[1].imgId!,
            imgVersion: response[1].imgVersion!,
            gifUrl: response[1].gifUrl!,
            reaction: ''
        });
        socketIONotificationObject.emit('insert notification', notifications, {userTo});

        const templateParams: INotificationTemplate = {
            username: response[2].username!,
            message: `${username} commented on your post.`,
            header: 'Comment Notification'
        };

        const template: string = notificationTemplate.notificationMessageTemplate(templateParams);
        emailQueue.addEmailJob('commentsEmail', {
            receiverEmail: response[2].email!,
            template,
            subject: 'Post notification'
        });
    }

}

  public async getPostComments(query: IQueryComment, sort: Record<string, 1| -1>): Promise<ICommentDocument[]>{
    const comments: ICommentDocument[] = await CommentsModel.aggregate([
      {$match: query},
      {$sort: sort}
    ])
    return comments;
  }

  public async getPostCommentNames(query: IQueryComment, sort: Record<string, 1 | -1>): Promise<ICommentNameList[]>{
    const commentsNamesList: ICommentNameList[] = await CommentsModel.aggregate([
      {$match: query},
      {$sort: sort},
      {$group: {_id: null, names: {$addToSet: '$username'}, count: {$sum: 1} }},
      {$project: {_id:0}}
    ])
    return commentsNamesList;
  }

}

export const commentService: CommentService = new CommentService();
