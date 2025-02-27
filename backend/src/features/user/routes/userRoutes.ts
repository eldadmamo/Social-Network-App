import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { GetUser } from '@user/controllers/get-profile';

class UserRoutes {
    private router: Router;


    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/user/all/:page', authMiddleware.checkAuthentication, GetUser.prototype.all);
        this.router.get('/user/profile', authMiddleware.checkAuthentication, GetUser.prototype.profile);
        this.router.get('/user/profile/:userId', authMiddleware.checkAuthentication, GetUser.prototype.profileByUserId);

        return this.router;
    }
}

export const userRoutes: UserRoutes = new UserRoutes();
