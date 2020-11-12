import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { month, year } = req.query;
    const provider_id = req.params.id;

    const listProviders = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const providers = await listProviders.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return res.json(providers);
  }
}
