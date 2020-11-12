import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListAllProviderAppointmentsService from '@modules/appointments/services/ListAllProviderAppointmentsService';

export default class AllProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.user.id;

    const listAllProvidersAppointments = container.resolve(
      ListAllProviderAppointmentsService,
    );
    const providers = await listAllProvidersAppointments.execute({
      provider_id,
    });

    return res.json(providers);
  }
}
