import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProfileControler {
  public async show(req: Request, res: Response): Promise<Response> {
    // exibir perfil

    const user_id = req.user.id;
    const showProfile = container.resolve(ShowProfileService);

    const userProfile = await showProfile.execute({ user_id });

    return res.json(classToClass(userProfile));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { name, email, old_password, password } = req.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const updatedUser = await updateProfile.execute({
      name,
      email,
      old_password,
      password,
      user_id,
    });

    return res.json(classToClass(updatedUser));
  }
}
