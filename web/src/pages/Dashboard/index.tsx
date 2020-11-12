import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import {
  isToday,
  format,
  parseISO,
  closestTo,
  isAfter,
  isEqual,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Calendar,
  Appointment,
  Section,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityInterface {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  dateFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectDate, setSelectDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityInterface[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment>();

  const { signOut, user } = useAuth();

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (!modifiers.disabled) {
      setSelectDate(day);
    }
  }, []);

  useEffect(() => {
    async function fetchApi() {
      const response = await api.get(
        `/providers/${user.id}/month-availability`,
        {
          params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1,
          },
        },
      );
      setMonthAvailability(response.data);
    }
    fetchApi();
  }, [currentMonth, user.id]);

  useEffect(() => {
    async function fetchApi() {
      const day = selectDate.getDate();
      const month = selectDate.getMonth();
      const year = selectDate.getFullYear();
      const { data } = await api.get<Appointment[]>('/appointments/me', {
        params: {
          month: month + 1,
          day,
          year,
        },
      });
      const appointmentsFormatted = data.map(appointment => {
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
        };
      });

      setAppointments(appointmentsFormatted);
    }

    fetchApi();
  }, [selectDate]);

  useEffect(() => {
    const dateToday = new Date();

    async function fetchApi() {
      const { data } = await api.get<Appointment[]>('/appointments/me/all');

      const nextAppointments = data.filter(appointment => {
        const formatedDate = parseISO(appointment.date);
        return isAfter(formatedDate, dateToday);
      });

      const closestDate = closestTo(
        dateToday,
        nextAppointments.map(appointment => parseISO(appointment.date)),
      );

      const closestAppointment = nextAppointments.find(appointment => {
        const isSameDate = isEqual(parseISO(appointment.date), closestDate);

        if (isSameDate) {
          appointment.hourFormatted = format(
            parseISO(appointment.date),
            'HH:mm',
          );

          appointment.dateFormatted = isToday(parseISO(appointment.date))
            ? 'Hoje'
            : format(
                parseISO(appointment.date),
                "'Dia' dd 'de' MMMM '|' cccc-'feira'",
                { locale: ptBR },
              );
          return isSameDate;
        }
        return undefined;
      });

      setNextAppointment(closestAppointment);
    }

    fetchApi();
  }, []);

  const disabledDays = useMemo(() => {
    const disabledDates = monthAvailability.filter(day => !day.available);
    const dates = disabledDates.map(disabledDay => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const { day } = disabledDay;

      const date = new Date(year, month, day);

      return date;
    });
    return dates;
  }, [currentMonth, monthAvailability]);

  const selectDateAsText = useMemo(() => {
    return format(selectDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
  }, [selectDate]);

  const selectDayofWeekAsText = useMemo(() => {
    return format(selectDate, "cccc'-feira'", { locale: ptBR });
  }, [selectDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() < 12,
    );
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() >= 12,
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <Link to="/me">
              <img
                src={
                  user.avatar_url ||
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1200px-Faenza-avatar-default-symbolic.svg.png'
                }
                alt={user.name}
              />
            </Link>
            <div>
              <span>Bem-vindo,</span>
              <Link to="/me">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectDate) && <span>Hoje</span>}
            <span>{selectDateAsText}</span>
            <span>{selectDayofWeekAsText}</span>
          </p>

          {nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <p>{nextAppointment.dateFormatted}</p>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <>
                <p>Ta de folga!</p>
                <span>Nenhum agendamento encontrado nesse período!</span>
              </>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {morningAppointments.length === 0 && (
              <>
                <p>Ta de folga!</p>
                <span>Nenhum agendamento encontrado nesse período!</span>
              </>
            )}
            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            onMonthChange={handleMonthChange}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            onDayClick={handleDateChange}
            selectedDays={selectDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
