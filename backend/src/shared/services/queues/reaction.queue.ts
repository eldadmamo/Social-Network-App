import { BaseQueue } from './base.queue';
import { IReactionJob } from '@root/features/reactions/interfaces/reaction.interface';
import { reactionWorker } from '@root/shared/workers/reaction.worker';

class ReactionQueue extends BaseQueue {
  constructor() {
    super('reactions');
    this.processJob('addReactionToDB', 5, reactionWorker.addRectionToDB);
    this.processJob('removeReactionFromDB', 5, reactionWorker.removeRectionDataFromDB);
  }

  public addReactionJob(name: string, data: IReactionJob): void {
    this.addJob(name, data);
  }
}

export const reactionQueue: ReactionQueue = new ReactionQueue();


