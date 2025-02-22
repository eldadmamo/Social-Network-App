import express, { Router } from 'express';
import { authMiddleware } from '@root/shared/globals/helpers/auth-middleware';
import { Add } from '../controllers/add-reactions';
import { Remove } from '../controllers/remove-reaction';
import { GetReaction } from '../controllers/get-reactions';

class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/post/reactions/:postId', authMiddleware.checkAuthentication, GetReaction.prototype.reactions);
    this.router.get('/post/single/reaction/username/:username/:postId', authMiddleware.checkAuthentication, GetReaction.prototype.singleReactionByUsername);
    this.router.get('/post/reactions/username/:username', authMiddleware.checkAuthentication, GetReaction.prototype.reactionsByUsername);


    this.router.post('/post/reaction', authMiddleware.checkAuthentication, Add.prototype.reaction);
    this.router.delete('/post/reaction/:postId/:previousReaction/:postReactions', authMiddleware.checkAuthentication, Remove.prototype.reaction);


    return this.router;
  }
}

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
