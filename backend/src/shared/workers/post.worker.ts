import { DoneCallback, Job } from "bull";
import Logger from "bunyan";
import { config } from "@root/config";
import { postService } from "../services/db/post.service";

const log: Logger = config.createLogger('postWorker')

class PostWorker {
  public async savePostToDB(job: Job, done: DoneCallback): Promise<void> {
    try{
      const {value, key} = job.data;
      // add to db
      await postService.addPostToDB(key,value);
      job.progress(100);
      done(null,job.data);
    } catch(error){
      log.error(error);
      done(error as Error);
    }
  }
}

export const postWorker: PostWorker = new PostWorker();
