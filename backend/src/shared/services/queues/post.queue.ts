import { BaseQueue } from './base.queue';
import { IPostJobData } from '@root/features/post/interfaces/post.interface';
import { postWorker } from '@root/shared/workers/post.worker';

class PostQueue extends BaseQueue {
  constructor() {
    super('posts');
    this.processJob('addPostToDB', 5, postWorker.savePostToDB);
    this.processJob('deletePostFromDB', 5, postWorker.savePostToDB);
    this.processJob('updatePostFromDB', 5, postWorker.updatePostiInDB);
  }

  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}

export const postQueue: PostQueue = new PostQueue();

