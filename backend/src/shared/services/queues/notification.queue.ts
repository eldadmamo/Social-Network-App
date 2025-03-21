import { BaseQueue } from "./base.queue";
import { INotificationJobData } from "@root/features/notifications/interfaces/notification.interface";
import { notificationWorker } from "@root/shared/workers/notification.worker";

class NotificationQueue extends BaseQueue {
  constructor(){
    super('notifications');
    this.processJob('updateNotification', 5, notificationWorker.updateNotification);
    this.processJob('deleteNotification', 5, notificationWorker.deleteNotification);
  }

  public addNotificationJob(name: string, data: INotificationJobData): void {
    this.addJob(name, data);
  }
}

export const notificationQueue: NotificationQueue = new NotificationQueue();
