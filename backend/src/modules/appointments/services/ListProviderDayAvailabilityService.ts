import { isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

// [{day:1, available:false},{day:2, available:false}]
@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    month,
    provider_id,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        day,
        provider_id,
        month,
        year,
      },
    );

    const hourStart = 8;
    const howManyAppointmentsInDay = 10;

    const eachHourArray = Array.from(
      { length: howManyAppointmentsInDay },
      (_, index) => index + hourStart,
    );
    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const appointmentInHour = appointments.filter(
        appointment => appointment.date.getHours() === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available:
          appointmentInHour.length === 0 && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}
