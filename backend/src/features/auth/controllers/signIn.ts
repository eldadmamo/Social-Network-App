import { Request, Response } from 'express';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@root/shared/globals/decorators/joi-validation.decorators';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@root/shared/services/db/auth.service';
import { BadRequestError } from '@root/shared/globals/helpers/error.handler';
import { loginSchema } from '../schemes/signin';
import { IAuthDocument } from '../interfaces/auth.interface';
import { IResetPasswordParams, IUserDocument } from '@root/features/user/interfaces/user.interface';
import { userService } from '@root/shared/services/db/user.service';
import { emailQueue } from '@root/shared/services/queues/email.queue';
import moment from 'moment';
import publicIP from 'ip';
import { resetPasswordTemplate } from '@root/shared/services/emails/templates/reset-password/reset-password-template';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) {
      throw new BadRequestError('Password Incorrect');
    }

    try {
      const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

      const userJwt: string = JWT.sign(
        {
          userId: user._id,
          uId: existingUser.uId,
          email: existingUser.email,
          username: existingUser.username,
          avatarColor: existingUser.avatarColor
        },
        config.JWT_TOKEN!
      );

      const templateParams: IResetPasswordParams = {
        username: existingUser.username!,
        email: existingUser.email!,
        ipaddress: publicIP.address(),
        date: moment().format('DD/MM/YYYY HH:mm')
      }

      const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
      emailQueue.addEmailJob('forgotPasswordEmail', {template, receiverEmail: 'tracey.ebert35@ethereal.email', subject: 'Password reset confirmation. your Password'});

      // const resetLink = `${config.CLIENT_URL}/reset-password?token=873456789876856787`;
      // const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
      // emailQueue.addEmailJob('forgotPasswordEmail', {template, receiverEmail: 'tracey.ebert35@ethereal.email', subject: 'Reset your password'})

      req.session = { jwt: userJwt };
      res.status(HTTP_STATUS.OK).json({ message: 'User logged in Successfully', user: existingUser, token: userJwt });
    } catch (error) {
      throw new BadRequestError('User not found');
    }
  }
}
