import HTTP_STATUS from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

export class SignOut {
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.session = null;
    res.status(HTTP_STATUS.OK).json({ message: 'Logout Successfull', user: {}, token: '' });
  }
}
