import { NextFunction, Request,Response } from "express";
import { config } from "@root/config";
import HTTP_STATUS  from 'http-status-codes';
import { authService } from "@root/shared/services/db/auth.service";
import { BadRequestError } from "@root/shared/globals/helpers/error.handler";
import { IAuthDocument } from "../interfaces/auth.interface";
import { joiValidation } from "@root/shared/globals/decorators/joi-validation.decorators";
import { emailSchema, passwordSchema } from "../schemes/password";
import crypto from 'crypto';
import { forgotPasswordTemplate } from "@root/shared/services/emails/templates/forgot-password/forgot-password-template";
import { emailQueue } from "@root/shared/services/queues/email.queue";
import { IResetPasswordParams } from "@root/features/user/interfaces/user.interface";
import publicIP from 'ip'
import moment from "moment";
import { resetPasswordTemplate } from "@root/shared/services/emails/templates/reset-password/reset-password-template";

export class Password {
  @joiValidation(emailSchema)
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {email} = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
    if(!existingUser){
      throw new BadRequestError('Invalid credentials')
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharaters: string = randomBytes.toString('hex');
    await authService.updatePasswordToken(`${existingUser._id}`,randomCharaters, Date.now() * 60 * 60 * 1000);

    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharaters}`;
    const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
    emailQueue.addEmailJob('forgotPasswordEmail',{template, receiverEmail: email, subject: 'Reset your password'})
    res.status(HTTP_STATUS.OK).json({message: 'Password reset email sent'})
  }

  @joiValidation(passwordSchema)
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {password, confirmPassword} = req.body;
    const { token } = req.params;
    if(password !== confirmPassword){
      throw new BadRequestError('Password do not match');
    }
    const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);
    if(!existingUser){
      throw new BadRequestError('Reset token has Expired')
    }

    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;
    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email!,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYY HH:mm')
    }

    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail',{template, receiverEmail: existingUser.email!, subject: 'Password Reset confirmation'})
    res.status(HTTP_STATUS.OK).json({message: 'Password Successfully updated'})
  }

}
