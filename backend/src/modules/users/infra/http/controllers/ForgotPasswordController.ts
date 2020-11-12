import SendAForgotPasswordEmail from '@modules/users/services/SendAForgotPasswordEmailService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendAForgotPasswordEmail = container.resolve(
      SendAForgotPasswordEmail,
    );

    await sendAForgotPasswordEmail.execute({ email });

    return res.status(204).json();
  }
}
