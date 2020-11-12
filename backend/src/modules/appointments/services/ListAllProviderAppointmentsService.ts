import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
}

// [{day:1, available:false},{day:2, available:false}]
@injectable()
export default class ListAllProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ provider_id }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-all-appointments:${provider_id}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllFromProvider(
        provider_id,
      );

      await this.cacheProvider.save(cacheKey, appointments);
    }

    return appointments;
  }
}
