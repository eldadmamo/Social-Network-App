import { IReactionDocument, IReactionJob } from "@root/features/reactions/interfaces/reaction.interface";
import { UserCache } from "../redis/user.cache";
import { ReactionModel } from "@root/features/reactions/models/reaction.schema";
import { PostModel } from "@root/features/post/models/post.schema";
import { IUserDocument } from "@root/features/user/interfaces/user.interface";
import { IPostDocument } from "@root/features/post/interfaces/post.interface";

const userCache: UserCache = new UserCache();

class ReactionSerivce {
  public async addReactionDataToDB(reactionData : IReactionJob): Promise<void> {
    const {postId, userTo, userFrom, username, type, previousReaction, reactionObject} = reactionData;

    const updatedReaction: [IUserDocument, IReactionDocument, IPostDocument] = await Promise.all([
      userCache.getUserFromCache(`${userTo}`),
      ReactionModel.replaceOne({postId: postId, type: previousReaction, username}, reactionObject, {upsert: true}),
      PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: {
            [`reactions.${previousReaction}`]: -1,
            [`reactions.${previousReaction}`]: 1
          }
        },
        { new : true }
      )
    ]) as [IUserDocument, IReactionDocument, IPostDocument];

  }
}

export const reactionSerivice: ReactionSerivce = new ReactionSerivce();
