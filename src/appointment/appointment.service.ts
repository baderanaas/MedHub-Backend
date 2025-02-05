import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LessThan,
  MoreThanOrEqual,
  Repository,
  MoreThan,
  Between,
  LessThanOrEqual,
} from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { StatusEnum } from 'src/common/enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PatientService } from 'src/patient/patient.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailableSessionsDto } from './dto/availableSessionsDto';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Injectable()
export class AppointmentService {
  // doctorRepository: any;
  // patientRepository: any;
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }
  async getAppointment(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: id },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }
  // async getPatientAppointments(username: string): Promise<Appointment[]> {
  // }
  async getUpcomingAppointments(username: string): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);

    if (!patient) {
      throw new NotFoundException(
        `Patient with username "${username}" not found`,
      );
    }

    const currentDate = new Date();

    const appointments = await this.appointmentRepository.find({
      where: {
        patient: { username: username },
        status: StatusEnum.ACCEPTED,
        date: MoreThan(currentDate),
      },
      order: { date: 'ASC' },
    });

    if (!appointments.length) {
      throw new NotFoundException('No upcoming appointments found');
    }

    return appointments;
  }

  async getPatientAppointments(username: string): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    console.log(patient);

    const appointments = await this.appointmentRepository.find({
      where: {
        patient: { username: username },
        date: MoreThanOrEqual(new Date()),
        status: StatusEnum.ACCEPTED,
      },
      order: { date: 'ASC' },
    });

    if (appointments.length === 0)
      throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getPatientRequests(username: string): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    console.log(patient);
    const appointments = await this.appointmentRepository.find({
      where: {
        patient: { username: username },
        date: MoreThanOrEqual(new Date()),
        status: StatusEnum.PENDING,
      },
    });

    console.log(appointments);
    if (!appointments) throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getPatientHistory(username: string): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);

    if (!patient) {
      throw new NotFoundException(
        `Patient with username "${username}" not found`,
      );
    }

    const appointments = await this.appointmentRepository.find({
      where: {
        patient: { username: username },
        status: StatusEnum.ACCEPTED,
        date: LessThan(new Date()),
      },
    });

    if (!appointments.length) {
      throw new NotFoundException('No  past appointments found');
    }

    return appointments;
  }

  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorById(doctorId);
    return doctor.appointments;
  }
  async getNextAppointment(username: string): Promise<Appointment> {
    const appointments = await this.getPatientAppointments(username);
    return appointments.at(0);
  }
  async getUpcomingAppointmentsNumber(username: string): Promise<number> {
    const appointments = await this.getPatientAppointments(username);
    return appointments.length;
  }
  async getNotPayedAppointments(username: string): Promise<number> {
    const appointments = await this.getPatientAppointments(username);
    const notPayed = appointments.filter(
      (appointment) => appointment.payed === false,
    );

    return notPayed.length;
  }
  async getByDoctorName(name: string): Promise<Appointment[]> {
    const doctors = await this.doctorService.searchDoctorByName(name);
    let allAppointments: Appointment[] = [];
    for (const doctor of doctors) {
      console.log('doctor in appointments: ', doctor);
      const appointmets = await this.appointmentRepository.find({
        where: {
          doctor: {
            matricule: doctor.matricule,
          },
          date: MoreThanOrEqual(new Date()),
          status: StatusEnum.ACCEPTED,
        },
        relations: ['doctor'],
      });
      console.log('appointments in appointment :', appointmets);
      allAppointments = allAppointments.concat(appointmets);
    }
    return allAppointments;
  }

  async addAppointment(
    data: CreateAppointmentDto,
    patientUserName: string,
    doctorMat: number,
  ): Promise<Appointment> {
    const patient =
      await this.patientService.getPatientByUserName(patientUserName);
    const doctor = await this.doctorService.getDoctorByMat(doctorMat);

    const appointment = await this.appointmentRepository.create({
      ...data,
      patient,
      doctor,
    });
    return this.appointmentRepository.save(appointment);
  }

  async updateAppointment(
    id: number,
    data: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    this.appointmentRepository.merge(appointment, data);
    console.log('dataaaaa', data);
    return this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(id: number): Promise<void> {
    const appointment = await this.getAppointment(id);
    appointment.status = StatusEnum.CANCELLED;
    await this.appointmentRepository.save(appointment);
    await this.appointmentRepository.softDelete(appointment.id);
  }
  async getAvailableSessions(
    availableSessionss: AvailableSessionsDto,
  ): Promise<number[]> {
    const { date, username } = availableSessionss;
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const allSessions = [1, 2, 3, 4, 5, 6, 7, 8];
    console.log('formatted', formattedDate);
    console.log(username);
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: {
          username: username,
        },
        date: formattedDate,
      },
    });
    console.log('appointments' + appointments);
    const reservedSessions = appointments.map(
      (appointment) => appointment.session,
    );
    console.log('reserved' + reservedSessions);
    const availableSessions = allSessions.filter(
      (session) => !reservedSessions.includes(session),
    );
    console.log('available' + availableSessions);
    return availableSessions;
  }
  async reschedule(id: number, data: CreateAppointmentDto) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id: id,
      },
    });

    if (appointment) {
      this.appointmentRepository.merge(appointment, data);
    }
    return await this.appointmentRepository.save(appointment);
  }

  async respondAppointment(
    id: number,
    status: StatusEnum,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  async completedAppointment(id: number): Promise<Appointment> {
    const appointment = await this.getAppointment(id);

    const THIRTY_MINUTES = 30 * 60 * 1000;
    const currentTime = new Date().getTime();
    const appointmentTime = new Date(appointment.date).getTime();

    if (currentTime - appointmentTime > THIRTY_MINUTES) {
      appointment.status = StatusEnum.COMPLETED;
      await this.appointmentRepository.save(appointment);
    }

    return appointment;
  }

  async getDoctorUpcomingAppointments(
    username: string,
  ): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorByUserName(username);
    console.log(doctor);

    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { username: username },
        date: MoreThanOrEqual(new Date()),
        status: StatusEnum.ACCEPTED,
      },
      order: { date: 'ASC' },
    });

    if (appointments.length === 0)
      throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getDoctorPassedAppointments(username: string): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorByUserName(username);
    console.log(doctor);

    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { username: username },
        date: LessThan(new Date()),
        status: StatusEnum.ACCEPTED,
      },
      order: { date: 'ASC' },
    });

    if (appointments.length === 0)
      throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getDoctorTodayAppointments(username: string): Promise<Appointment[]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { username: username },
        date: Between(todayStart, todayEnd),
        status: StatusEnum.ACCEPTED,
      },
      order: { date: 'ASC' },
    });

    if (appointments.length === 0) console.log('no app');
    return appointments;
  }

  async getDoctorRequestedAppointments(
    username: string,
  ): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorByUserName(username);
    console.log(doctor);

    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { username: username },
        date: MoreThanOrEqual(new Date()),
        status: StatusEnum.PENDING,
      },
      order: { date: 'ASC' },
    });

    if (appointments.length === 0) {
      console.log('no requests');
    }
    return appointments;
  }

  async getCompletedAppointmentsByDoctorAndPatient(
    doctorUsername: string,
    patientUsername: string,
  ): Promise<Appointment[]> {
    // Find the doctor by username
    const doctor = await this.doctorRepository.findOne({
      where: { username: doctorUsername },
    });

    if (!doctor) {
      throw new NotFoundException(
        'Doctor with username ${doctorUsername} not found',
      );
    }

    // Find the patient by username
    const patient = await this.patientRepository.findOne({
      where: { username: patientUsername },
    });

    if (!patient) {
      throw new NotFoundException(
        'Patient with username ${patientUsername} not found',
      );
    }

    // Fetch only completed appointments for the specific doctor and patient
    return await this.appointmentRepository.find({
      where: {
        doctor: { id: doctor.id },
        patient: { id: patient.id },
        date: LessThanOrEqual(new Date()),
        status: StatusEnum.ACCEPTED,
      },
      relations: ['patient', 'doctor'],
    });
  }
}
