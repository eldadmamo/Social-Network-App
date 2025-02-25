import express, { Router } from 'express';
import { authMiddleware } from '@root/shared/globals/helpers/auth-middleware';
import { Add } from '@chat/controllers/add-chat-message';
import { Get } from '@chat/controllers/get-chat-messages';


class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/chat/message/conversation-list', authMiddleware.checkAuthentication, Get.prototype.conversationList);
    this.router.post('/chat/message', authMiddleware.checkAuthentication, Add.prototype.message);
    this.router.post('/chat/message/add-chat-users', authMiddleware.checkAuthentication, Add.prototype.addChatUsers);
    this.router.post('/chat/message/remove-chat-users', authMiddleware.checkAuthentication, Add.prototype.removeChatUsers);
    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
