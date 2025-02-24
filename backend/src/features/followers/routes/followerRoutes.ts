import express, { Router } from 'express';
import { authMiddleware } from '@root/shared/globals/helpers/auth-middleware';
import { Add } from '../controller/follower-user';
import { Remove } from '../controller/unfollow-user';
import { GetFollow } from '../controller/get-followers';

class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkAuthentication, Remove.prototype.follower);


    this.router.get('/user/following', authMiddleware.checkAuthentication, GetFollow.prototype.userFollowing);
    this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, GetFollow.prototype.userFollowers);

    return this.router;
  }
}

export const followerRoute: FollowerRoutes = new FollowerRoutes();
