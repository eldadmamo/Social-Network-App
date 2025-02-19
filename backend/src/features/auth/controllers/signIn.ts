import { Request, Response } from "express";
import { config } from "@root/config";
import JWT from 'jsonwebtoken'
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import  HTTP_STATUS  from 'http-status-codes';
import { authService } from "@root/shared/services/db/auth.service";
import { BadRequestError } from "@root/shared/globals/helpers/error.handler";
import { loginSchema } from "../schemes/signin";
import { IAuthDocument } from "../interfaces/auth.interface";



export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const {username, password} = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
    if(!existingUser){
      throw new BadRequestError('Invalid Credentials')
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password)
    if(!passwordsMatch){
      throw new BadRequestError('Invalid credentials')
    }

    const userJwt: string = JWT.sign(
      {
        userId: existingUser._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = {Jwt: userJwt}

    res.status(HTTP_STATUS.OK).json({message: 'User logged in Successfully', users: existingUser, token: userJwt})
  }
}
