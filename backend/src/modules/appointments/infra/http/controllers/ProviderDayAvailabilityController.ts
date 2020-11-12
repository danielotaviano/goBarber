import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { month, year, day } = req.query;
    const { provider_id } = req.params;

    const listProviders = container.resolve(ListProviderDayAvailabilityService);

    const providers = await listProviders.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
      day: Number(day),
    });

    return res.json(providers);
  }
}
