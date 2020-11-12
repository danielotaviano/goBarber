import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.user.id;
    const { year, month, day } = req.query;

    const listProvidersAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    const providers = await listProvidersAppointments.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
      day: Number(day),
    });

    return res.json(providers);
  }
}
