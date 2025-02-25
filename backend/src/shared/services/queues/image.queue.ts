import { BaseQueue } from "./base.queue";
import { IFileImageJobData } from "@root/features/images/interfaces/image.interface";
import { imageWorker } from "@root/shared/workers/image.worker";

class ImageQueue extends BaseQueue {
  constructor(){
    super('emails');
    this.processJob('addUserProfileImageDB', 5, imageWorker.addUserProfileImageDB);
    this.processJob('updateBGImageInDB', 5, imageWorker.updateBGImageInDB);
    this.processJob('addImageToDB', 5, imageWorker.addImageToDB);
    this.processJob('removeImageFromDB', 5, imageWorker.removeImageFromDB);
  }

  public addImageJob(name: string, data: IFileImageJobData): void {
    this.addJob(name, data);
  }
}

export const imageQueue: ImageQueue = new ImageQueue();
