import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllIIMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllIIDayFromProviderDTO';

export default interface IAppointmentsRepository {
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;

  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;

  findById(id: string): Promise<Appointment | undefined>;
  findAllFromProvider(provider_id: string): Promise<Appointment[]>;
}
