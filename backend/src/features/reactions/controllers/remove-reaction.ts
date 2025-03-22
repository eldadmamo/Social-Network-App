import { Request,Response } from "express";
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { addReactionSchema } from "../schemes/reactions";
import {  IReactionJob } from "../interfaces/reaction.interface";
import { ReactionCache } from './../../../shared/services/redis/reaction.cache';
import { reactionQueue } from "@root/shared/services/queues/reaction.queue";


const reactionCache: ReactionCache = new ReactionCache();


export class Remove {
  public async reaction(req: Request, res: Response): Promise<void> {
    const {postId, previousReaction, postReactions} = req.params;

    await reactionCache.removePostReactionToCache(postId, `${req.currentUser!.username}`, JSON.parse(postReactions));

    const databaseRectionData: IReactionJob = {
      postId,
      username: req.currentUser!.username,
      previousReaction,
    }
    reactionQueue.addReactionJob('removeReactionFromDB', databaseRectionData);

    res.status(HTTP_STATUS.OK).json({message: 'Reaction remove from POST'})
  }
}
