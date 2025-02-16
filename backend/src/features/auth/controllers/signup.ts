import { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { signupSchema } from "../schemes/signup";
import { IAuthDocument } from "../interfaces/auth.interface";
import { authService } from "@root/shared/services/db/auth.service";
import { BadRequestError } from "@root/shared/globals/helpers/error.handler";


export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res:Response): Promise<void> {
    const {username, email, password, avatarColor, avatarImage} = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username,email);
    if(checkIfUserExist){
      throw new BadRequestError('Invalid Credentials');
    }
  }
}
