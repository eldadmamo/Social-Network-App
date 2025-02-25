import { ImageModel } from "@root/features/images/models/image.schema";
import { UserModel } from "@root/features/user/models/user.schema"
import mongoose from "mongoose"
import { userInfo } from "os";

class ImageService {
  public async addUserProfileImageToDB(userId: string, url: string, imgId: string, imgVersion: string): Promise<void> {
    await UserModel.updateOne({_id: userId}, {$set: {profilePicture: url}}).exec();
    await this.addImage(userId, imgId, imgVersion, 'profile')
  }

  public async addBackgroundImageDB(userId: string, url: string, imgId: string, imgVersion: string): Promise<void> {
    await UserModel.updateOne({_id: userId}, {$set: {bgImageId: imgId, bgImageVersion: imgVersion}}).exec();
    await this.addImage(userId, imgId, imgVersion, 'background')
  }

  private async addImage(userId: string, imgId: string, imgVersion: string, type: string): Promise<void> {
    await ImageModel.create({
      userId,
      bgImageVersion: type === 'background' ? imgVersion: '',
      bgImageId: type === 'background' ? imgId: '',
      imgVersion: type === 'profile' ? imgVersion: '',
      imgId: type === 'profile' ? imgId: '',
    })
  }

  public async removeImageFromDB(imageId: string): Promise<void> {
    await ImageModel.deleteOne({_id: imageId}).exec();
  }
}

export const imageService: ImageService = new ImageService()
