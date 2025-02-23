import express, { Router } from 'express';
import { authMiddleware } from '@root/shared/globals/helpers/auth-middleware';
import { GetComment } from '../controllers/get-comments';
import { Add } from '../controllers/add-comment';


class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/post/comment/:postId', authMiddleware.checkAuthentication, GetComment.prototype.comment);
    this.router.get('/post/commentsname/:postId', authMiddleware.checkAuthentication, GetComment.prototype.commentNamesFromCache);
    this.router.get('/post/single/comment/:postId/:commentId', authMiddleware.checkAuthentication, GetComment.prototype.singleComment);

    this.router.post('/post/comment', authMiddleware.checkAuthentication, Add.prototype.comment);
    return this.router;
  }
}

export const commentRoutes: CommentRoutes = new CommentRoutes();
