import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { reactionSerivice } from '../services/db/reaction.service';

const log: Logger = config.createLogger('reactionWorker');

class ReactionWorker {
  async addRectionToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job;
      await reactionSerivice.addReactionDataToDB(data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }

  async removeRectionDataFromDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job;
      await reactionSerivice.removeReactionDataFromDB(data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const reactionWorker: ReactionWorker = new ReactionWorker();
