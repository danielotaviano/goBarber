import { getRepository, Raw, Repository } from 'typeorm';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInMothFromProvider from '@modules/appointments/dtos/IFindAllIIMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllIIDayFromProviderDTO';
import { classToClass } from 'class-transformer';

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findAllInDayFromProvider({
    month,
    year,
    provider_id,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = month.toString().padStart(2, '0');
    const parsedDay = day.toString().padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `TO_CHAR(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return classToClass(appointments);
  }

  public async findAllInMonthFromProvider({
    month,
    year,
    provider_id,
  }: IFindAllInMothFromProvider): Promise<Appointment[]> {
    const parsedMonth = month.toString().padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `TO_CHAR(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findById(id: string): Promise<Appointment | undefined> {
    const appointment = this.ormRepository.findOne({ where: { id } });

    return appointment;
  }

  public async create({
    date,
    provider_id,
    user_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findAllFromProvider(
    provider_id: string,
  ): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      where: { provider_id },
      relations: ['user'],
    });
    return classToClass(appointments);
  }
}

export default AppointmentsRepository;
