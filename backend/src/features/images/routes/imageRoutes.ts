 import express, { Router } from 'express';
 import { authMiddleware } from '@root/shared/globals/helpers/auth-middleware';
 import { AddImage } from '../controllers/add-image';
import { DeleteImage } from '../controllers/delete-image';
import { Get } from '../controllers/get-images';


 class ImageRoutes {
   private router: Router;

   constructor() {
     this.router = express.Router();
   }

   public routes(): Router {
    this.router.get('/images/:userId', authMiddleware.checkAuthentication, Get.prototype.images);

    this.router.post('/images/profile', authMiddleware.checkAuthentication, AddImage.prototype.profileImage);
    this.router.post('/images/background', authMiddleware.checkAuthentication, AddImage.prototype.backgroundImage);

    this.router.delete('/images/:imageId', authMiddleware.checkAuthentication, DeleteImage.prototype.image);
    this.router.delete('/images/background/:bgImageId', authMiddleware.checkAuthentication, DeleteImage.prototype.backgroundImage);

     return this.router;
   }
 }

 export const imageRoutes: ImageRoutes = new ImageRoutes();
