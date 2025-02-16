import mongoose from "mongoose";
import { Request, Response } from "express";
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { signupSchema } from "../schemes/signup";
import { IAuthDocument, ISignUpData } from "../interfaces/auth.interface";
import { authService } from "@root/shared/services/db/auth.service";
import { BadRequestError } from "@root/shared/globals/helpers/error.handler";
import { Helpers } from "@root/shared/globals/helpers/helpers";
import { UploadApiOptions } from "cloudinary";
import { uploads } from "@root/shared/globals/helpers/cloudinary-upload";
import HTTP_STATUS  from 'http-status-codes';


export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res:Response): Promise<void> {
    const {username, email, password, avatarColor, avatarImage} = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username,email);
    if(checkIfUserExist){
      throw new BadRequestError('Invalid Credentials');
    }

    const authObjectId = new mongoose.Types.ObjectId();
    const userObjectId = new mongoose.Types.ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`
    const authData: IAuthDocument = SignUp.prototype.signUpData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor
    });
    const result: UploadApiOptions = await uploads(avatarImage, `${userObjectId}`, true, true) as UploadApiOptions;
    if(!result?.public_id){
      throw new BadRequestError('File upload: Error Occured. Try Again.')
    }

    res.status(HTTP_STATUS.CREATED).json({message: 'User created Successfully', authData})

  }

  private signUpData(data: ISignUpData): IAuthDocument{
    const {_id, username, email, uId, password,avatarColor} = data;
    return {
      _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowerCase(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as unknown as IAuthDocument;
  }
}
