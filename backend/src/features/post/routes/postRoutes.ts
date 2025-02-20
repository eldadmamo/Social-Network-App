import express, { Router } from 'express';
import { authMiddleware } from '@root/shared/globals/helpers/auth-middleware';
import { Create } from '../controllers/create-post';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/post', authMiddleware.checkAuthentication, Create.prototype.post);
    this.router.post('/post/image/post', authMiddleware.checkAuthentication, Create.prototype.postWithimage);

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
