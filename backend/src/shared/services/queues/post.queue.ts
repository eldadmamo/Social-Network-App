import { IAuthJob } from '@root/features/auth/interfaces/auth.interface';
import { BaseQueue } from './base.queue';
import { authWorker } from '@root/shared/workers/auth.worker';
import { IPostJobData } from '@root/features/post/interfaces/post.interface';
import { postWorker } from '@root/shared/workers/post.worker';

class PostQueue extends BaseQueue {
  constructor() {
    super('posts');
    this.processJob('addPostToDB', 5, postWorker.savePostToDB);
  }

  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}

export const postQueue: PostQueue = new PostQueue();

