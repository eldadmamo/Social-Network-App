import { Request,Response } from "express";
import HTTP_STATUS from 'http-status-codes';
import { ICommentDocument, ICommentNameList } from "../interfaces/comment.interface";
import { CommentCache } from "@root/shared/services/redis/comment.cache";
import { commentService } from "@root/shared/services/db/comment.service";
import mongoose from "mongoose";

const commentCache: CommentCache = new CommentCache();

export class GetComment {
  public async comment(req: Request, res: Response): Promise<void> {
    const {postId} = req.params;
    const cachedComments: ICommentDocument[] = await commentCache.getCommentFromCache(postId);
    const comments: ICommentDocument[] = cachedComments.length
    ? cachedComments
    : await commentService.getPostComments({postId: new mongoose.Types.ObjectId(postId)},{createdAt: -1})

    res.status(HTTP_STATUS.OK).json({message: 'Post Comment successfully', comments})
  }


  public async commentNamesFromCache(req: Request, res: Response): Promise<void> {
    const {postId} = req.params;
    const cachedCommentsNames: ICommentNameList[] = await commentCache.getCommentNameFromCache(postId);
    const commentsNames: ICommentNameList[] = cachedCommentsNames.length
    ? cachedCommentsNames
    : await commentService.getPostCommentNames({postId: new mongoose.Types.ObjectId(postId)},{createdAt: -1})

    res.status(HTTP_STATUS.OK).json({message: 'Post Comment names successfully', comments: commentsNames.length ? commentsNames[0] : []})
  }


  public async singleComment(req: Request, res: Response): Promise<void> {
    const {postId, commentId} = req.params;
    const cachedComments: ICommentDocument[] = await commentCache.getSingleCommentFromCache(postId, commentId);
    const comments: ICommentDocument[] = cachedComments.length
    ? cachedComments
    : await commentService.getPostComments({_id: new mongoose.Types.ObjectId(commentId)},{createdAt: -1})

    res.status(HTTP_STATUS.OK).json({message: 'Single Comment', comments: comments.length ? comments[0] : []})
  }
}
