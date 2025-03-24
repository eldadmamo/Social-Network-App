import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { UserCache } from "@root/shared/services/redis/user.cache";
import { Request,Response } from "express";
import { addImageSchema } from "../schemes/images";
import { UploadApiResponse } from "cloudinary";
import { uploads } from "@root/shared/globals/helpers/cloudinary-upload";
import { BadRequestError } from "@root/shared/globals/helpers/error.handler";
import { IUserDocument } from "@root/features/user/interfaces/user.interface";
import { socketIOImageObject } from "@root/shared/sockets/image";
import { imageQueue } from "@root/shared/services/queues/image.queue";
import HTTP_STATUS  from 'http-status-codes';
import { IBgUploadResponse } from "../interfaces/image.interface";
import { Helpers } from "@root/shared/globals/helpers/helpers";

const userCache: UserCache = new UserCache();

export class AddImage {
  @joiValidation(addImageSchema)
  public async  profileImage(req: Request, res: Response): Promise<void> {
    const result: UploadApiResponse = (await uploads(req.body.image, req.currentUser!.userId, true, true)) as UploadApiResponse;
    if(!result?.public_id){
      throw new BadRequestError('File upload: Error occured. Try again')
    }

    const url = `https://res.cloudinary.com/dggixttgq/image/upload/v${result.version}/${result.public_id}`;
    const cachedUser: IUserDocument | null = (await userCache.updateSingleUserItemInCache(
      `${req.currentUser!.userId}`,
      'profilePicture',
      url
    )) as IUserDocument;
    socketIOImageObject.emit('update user', cachedUser);
    imageQueue.addImageJob('addUserProfileImageToDB', {
      key: `${req.currentUser!.userId}`,
      value: url,
      imgId: result.public_id,
      imgVersion: result.version.toString()
    });
    res.status(HTTP_STATUS.OK).json({message: "image added Successfully"})
  }


  @joiValidation(addImageSchema)
    public async backgroundImage(req: Request, res: Response): Promise<void> {
        const {version, publicId}: IBgUploadResponse = await AddImage.prototype.backgroundUpload(req.body.image);

        const bgImageId: Promise<IUserDocument> = await userCache.updateSingleUserItemInCache(
            `${req.currentUser!.userId}`,
            'bgImageId',
            publicId
        ) as unknown as Promise<IUserDocument>;

        const bgImageVersion: Promise<IUserDocument> = await userCache.updateSingleUserItemInCache(
            `${req.currentUser!.userId}`,
            'bgImageVersion',
            version
        ) as unknown as Promise<IUserDocument>;

        const response: [IUserDocument, IUserDocument] = await Promise.all([bgImageId, bgImageVersion]) as [IUserDocument, IUserDocument];

        socketIOImageObject.emit('update user', {
            bgImageId: publicId,
            bgImageVersion: version,
            userId: response[0]
        });


        imageQueue.addImageJob('updateBGImageInDB', {
            key: `${req.currentUser!.userId}`,
            imgId: publicId,
            imgVersion: version.toString()
        });

        res.status(HTTP_STATUS.OK).json({message: 'Image added successfully'});
    }

    private async backgroundUpload(image: string): Promise<IBgUploadResponse> {
        const isDataURL = Helpers.isDataURL(image);
        let version = '';
        let publicId = '';
        if (isDataURL) {
            const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
            if (!result.public_id) {
                throw new BadRequestError(result.message);
            } else {
                version = result.version.toString();
                publicId = result.public_id;
            }
        } else {
            const value = image.split('/');
            version = value[value.length - 2];
            publicId = value[value.length - 1];
        }

        return {version: version.replace(/v/g, ''), publicId};
    }
}
