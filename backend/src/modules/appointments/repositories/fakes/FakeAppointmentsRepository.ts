import { v4 } from 'uuid';

import { isEqual } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInMothFromProviderDTO from '@modules/appointments/dtos/IFindAllIIMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllIIDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findAllInDayFromProvider({
    month,
    year,
    provider_id,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.date.getFullYear() === year &&
        appointment.date.getMonth() + 1 === month &&
        appointment.date.getDate() === day &&
        appointment.provider_id === provider_id
      );
    });

    return appointments;
  }

  public async findAllInMonthFromProvider({
    month,
    year,
    provider_id,
  }: IFindAllInMothFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.date.getFullYear() === year &&
        appointment.date.getMonth() + 1 === month &&
        appointment.provider_id === provider_id
      );
    });

    return appointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;
  }

  public async findById(id: string): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => appointment.id === id,
    );

    return findAppointment;
  }

  public async create({
    date,
    provider_id,
    user_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: v4(), date, provider_id, user_id });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllFromProvider(
    provider_id: string,
  ): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment => appointment.provider_id === provider_id,
    );
    return appointments;
  }
}
export default AppointmentsRepository;
