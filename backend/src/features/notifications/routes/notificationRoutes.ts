import express, { Router } from 'express';
import { authMiddleware } from '@root/shared/globals/helpers/auth-middleware';
import { Update } from '../controllers/update-notification';
import { Delete } from '../controllers/delete-notification';
import { GetNotification } from '../controllers/get-notifications';


class NotificationRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/notifications', authMiddleware.checkAuthentication, GetNotification.prototype.notifications);
    this.router.put('/notification/:notificationId', authMiddleware.checkAuthentication, Update.prototype.notification);
    this.router.delete('/notification/:notificationId', authMiddleware.checkAuthentication, Delete.prototype.notification);

    return this.router;
  }
}

export const notificationRoutes: NotificationRoutes = new NotificationRoutes();
