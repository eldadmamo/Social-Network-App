import { BaseQueue } from './base.queue';
import { chatWorker } from '@worker/chat.worker';
import { IChatJobData, IMessageData } from '@chat/interfaces/chat.interface';

class ChatQueue extends BaseQueue {
  constructor() {
    super('chats');
    this.processJob('addChatUserToDB', 5, chatWorker.addChatMessageToDB);

  }

  public addChatJob(name: string, data: IChatJobData | IMessageData ): void {
    this.addJob(name, data);
  }
}

export const chatQueue: ChatQueue = new ChatQueue();


