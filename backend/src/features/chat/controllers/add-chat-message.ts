import { Request,Response } from "express";
import HTTP_STATUS, { REQUESTED_RANGE_NOT_SATISFIABLE }  from 'http-status-codes';
import { UserCache } from "@service/redis/user.cache";
import { IUserDocument } from "@user/interfaces/user.interface";
import { joiValidation } from "@global/decorators/joi-validation.decorators";
import { addChatSchema } from "@chat/schemes/chat";
import { ObjectId } from 'mongodb';
import mongoose, { mongo } from "mongoose";
import { UploadApiResponse } from "cloudinary";
import { uploads } from "@global/helpers/cloudinary-upload";
import { BadRequestError } from "@global/helpers/error.handler";
import { IMessageData } from "@chat/interfaces/chat.interface";

const userCache: UserCache = new UserCache();

export class Add {
  @joiValidation(addChatSchema)
  public async message(req: Request, res:Response): Promise<void> {
    const {
      conversationId,
      receiverId,
      receiverUsername,
      receiverAvatarColor,
      receiverProfilePicture,
      body,
      gifUrl,
      isRead,
      selectedImage
    } = req.body;

    let fileUrl = '';
    const messageObjectId: ObjectId = new ObjectId();
    const conversationObjectId: ObjectId = !conversationId ? new ObjectId() : new mongoose.Types.ObjectId(conversationId);

    const sender: IUserDocument = await userCache.getUserFromCache(`${req.currentUser!.userId}`) as IUserDocument;

    if(selectedImage.length){
      const result: UploadApiResponse = (await uploads(req.body.image, req.currentUser!.userId, true, true)) as UploadApiResponse;
      if(!result.public_id){
        throw new BadRequestError(result.message)
      }
      fileUrl = `https://res.cloudinary.com/dggixttgq/image/upload/v${result.version}/${result.public_id}`;
    }

    const messageData: IMessageData = {
      _id: `${messageObjectId}`,
      conversationId: new mongoose.Types.ObjectId(conversationObjectId),
      receiverId,
      receiverAvatarColor,
      receiverProfilePicture,
      receiverUsername,
      senderUsername: `${req.currentUser!.username}`,
      senderId: `${req.currentUser!.userId}`,
      senderAvatarColor: `${sender.profilePicture}`,
      body,
      isRead,
      selectedImage: fileUrl,
      reaction:[],
      createdAt: new Date(),
      deleteForEveryone: false,
      deleteForMe: false,
    }
  }
}
