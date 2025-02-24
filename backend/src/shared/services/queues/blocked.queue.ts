import { IBlockedUserJobData } from "@root/features/followers/interfaces/follower.interface";
import { BaseQueue } from "./base.queue";
import { blockedUserWorker } from "@root/shared/workers/blocked.worker";

class BlockUserQueue extends BaseQueue {
  constructor(){
    super('blockedUsers');
    this.processJob('addBlockedUserToDB', 5, blockedUserWorker.addBlockedUserToDB);
    this.processJob('removeBlockedUserFromDB', 5, blockedUserWorker.addBlockedUserToDB)
  }

  public addBlockedUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  }
}

export const blockedUserQueue: BlockUserQueue = new BlockUserQueue();
