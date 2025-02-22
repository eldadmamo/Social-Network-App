import { Request,Response } from "express";
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { addReactionSchema } from "../schemes/reactions";
import { IReactionDocument } from "../interfaces/reaction.interface";
import { ObjectId } from 'mongodb';
import { ReactionCache } from './../../../shared/services/redis/reaction.cache';

const reactionCache: ReactionCache = new ReactionCache();


export class Add {
  @joiValidation(addReactionSchema)
  public async reaction(req: Request, res: Response): Promise<void> {
    const {userTo, postId, type, previousReaction, postReactions, profilePicture} = req.body;
    const reactionObject: IReactionDocument = {
      _id: new ObjectId(),
      postId,
      type,
      avataColor: req.currentUser!.avatarColor,
      username: req.currentUser!.username,
      profilePicture
    } as IReactionDocument;

    await reactionCache.savePostReactionToCache(postId, reactionObject, postReactions, type, previousReaction);

    res.status(HTTP_STATUS.OK).json({message: 'Reaction added successfully'})
  }
}
