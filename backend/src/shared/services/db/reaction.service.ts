import { IReactionDocument, IReactionJob } from "@root/features/reactions/interfaces/reaction.interface";
import { UserCache } from "../redis/user.cache";
import { ReactionModel } from "@root/features/reactions/models/reaction.schema";
import { PostModel } from "@root/features/post/models/post.schema";
import { IUserDocument } from "@root/features/user/interfaces/user.interface";
import { IPostDocument } from "@root/features/post/interfaces/post.interface";
import { omit } from "lodash";

const userCache: UserCache = new UserCache();

class ReactionSerivce {
  public async addReactionDataToDB(reactionData : IReactionJob): Promise<void> {
    const {postId, userTo, userFrom, username, type, previousReaction, reactionObject} = reactionData;

    let updatedReactionObject: IReactionDocument = reactionObject as IReactionDocument;
    if(previousReaction){
      updatedReactionObject = omit(reactionObject, ['_id']);
    }
    const updatedReaction: [IUserDocument, IReactionDocument, IPostDocument] = (await Promise.all([
      userCache.getUserFromCache(`${userTo}`),
      ReactionModel.replaceOne({ postId, type: previousReaction, username }, updatedReactionObject, { upsert: true }),
      PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: {
            [`reactions.${previousReaction}`]: -1,
            [`reactions.${type}`]: 1
          }
        },
        { new: true }
      )
    ])) as unknown as [IUserDocument, IReactionDocument, IPostDocument];

  }

  public async removeReactionDataFromDB(reactionData: IReactionJob): Promise<void> {
    const {postId, previousReaction, username} = reactionData;
    await Promise.all([
      ReactionModel.deleteOne({postId, type: previousReaction, username}),
      PostModel.updateOne(
        {_id: postId},
        {
          $inc:{
            [`reactions.${previousReaction}`]: -1
          },
        },
        {new: true}
      )
    ])
  }
}

export const reactionSerivice: ReactionSerivce = new ReactionSerivce();
