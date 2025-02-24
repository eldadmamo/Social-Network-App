import { BaseQueue } from "./base.queue";
import { followerWorker } from "@root/shared/workers/follower.worker";
import { IFollowerJobData } from "@root/features/followers/interfaces/follower.interface";

class FollowQueue extends BaseQueue {
  constructor(){
    super('followers');
    this.processJob('addFollowerToDB', 5, followerWorker.addFollowerToDB)
    this.processJob('removeFollowerFromDB', 5, followerWorker.removeFollowerFromDB)
  }

  public addFollowerJob(name: string, data: IFollowerJobData): void {
    this.addJob(name, data);
  }
}

export const followerQueue: FollowQueue = new FollowQueue();
