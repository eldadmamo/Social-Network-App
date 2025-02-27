import { BaseQueue } from "./base.queue";
import { ICommentJob } from "@root/features/comment/interfaces/comment.interface";
import { commentWorker } from "@root/shared/workers/comment.worker";

class CommentQueue extends BaseQueue {
  constructor(){
    super('comments');
    this.processJob('addCommentToDB', 5, commentWorker.addCommentToDB);
  }

  public addCommentJob(name: string, data: ICommentJob): void {
    this.addJob(name, data);
  }
}

export const commentQueue: CommentQueue = new CommentQueue();
