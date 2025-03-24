import { BaseQueue } from './base.queue';
import { chatWorker } from '@worker/chat.worker';
import { IChatJobData, IMessageData } from '@chat/interfaces/chat.interface';

class ChatQueue extends BaseQueue {
  constructor() {
    super('chats');
    this.processJob('addChatMessageToDB', 5, chatWorker.addChatMessageToDB);
    this.processJob('markMessageAsDeletedinDB', 5, chatWorker.markMessageAsDeleted);
    this.processJob('markMessagesAsReadInDB', 5, chatWorker.markMessagesAsReadInDB);
    this.processJob('updateMessageReaction', 5, chatWorker.updateMessageReaction);
  }

  public addChatJob(name: string, data: IChatJobData | IMessageData ): void {
    this.addJob(name, data);
  }
}

export const chatQueue: ChatQueue = new ChatQueue();


