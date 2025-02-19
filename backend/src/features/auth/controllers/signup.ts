import { ObjectId } from "mongodb";
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
import { IUserDocument } from "@root/features/user/interfaces/user.interface";
import { UserCache } from "@root/shared/services/redis/user.cache";
import { omit } from "lodash";
import { authQueue } from "@root/shared/services/queues/auth.queue";


const userCache: UserCache = new UserCache();

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res:Response): Promise<void> {
    const {username, email, password, avatarColor, avatarImage} = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username,email);
    if(checkIfUserExist){
      throw new BadRequestError('Invalid Credentials');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
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

    // Add to redis Cache
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/dggixttgq/image/upload/v${result.version}/${userObjectId}`;
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    // Add
    omit(userDataForCache, ['uId', 'username', 'email', 'avatarColor', 'password']);
    authQueue.addAuthUserJob('addAuthUserDB',{value: userDataForCache})

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

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const {_id, username, email,uId, password, avatarColor} = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked:[],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion:'',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications:{
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube:''
      }
    } as unknown as IUserDocument;
  }
}
