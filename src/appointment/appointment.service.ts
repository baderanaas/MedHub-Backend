import { Injectable, NotFoundException } from '@nestjs/common';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { StatusEnum } from 'src/common/enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailableSessionsDto } from './dto/availableSessionsDto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {}

  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['doctor', 'patient'],
    });
  }

  async getAppointment(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: id },
      relations: ['doctor', 'patient'],
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }
  async getPatientAppointment(userName: string): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.find({
      where: { patient: { username: userName } },
      relations: ['doctor'],
    });
  
    console.log('Fetched Appointments:', appointments);
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

  async getPatientAppointmentsHistory(
    username: string,
    query: { status?: StatusEnum; date?: Date } = {},
  ): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = { patient: patient };

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.date) {
      whereClause.date = query.date;
    }

    const appointments = await this.appointmentRepository.find({
      where: whereClause,
      order: { date: 'DESC' },
    });

    if (!appointments.length)
      throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getPatientUpcomingAppointments(
    username: string,
  ): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    return this.appointmentRepository.find({
      where: {
        patient: patient,
        date: LessThan(new Date()),
        status: StatusEnum.ACCEPTED,
      },
      order: { date: 'ASC' },
    });
  }

  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorById(doctorId);
    return doctor.appointments;
  }
  async getByDoctorName(name: string): Promise<Appointment[]> {
    const doctors = await this.doctorService.getDoctorByName(name);
    let allAppointments: Appointment[] = [];
    for (const doctor of doctors) {
      console.log('doctor in appointments: ', doctor);
      const appointmets = await this.appointmentRepository.find({
        where: {
          doctor: {
            matricule: doctor.matricule,
          },
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
    const appointment = this.appointmentRepository.create({
      ...data,
      patient: patient,
      doctor: doctor,
      status: StatusEnum.PENDING,
    });
    return this.appointmentRepository.save(appointment);
  }

  async updateAppointmentByDoctor(
    id: number,
    data: UpdateAppointmentDto,
    matricule: number,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.doctor.matricule === matricule) {
      this.appointmentRepository.merge(appointment, data);
      return this.appointmentRepository.save(appointment);
    }
    throw new Error('Doctor not authorized to update this appointment');
  }

  async updateAppointmentByPatient(
    id: number,
    data: UpdateAppointmentDto,
    username: string,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.patient.username === username) {
      this.appointmentRepository.merge(appointment, data);
      return this.appointmentRepository.save(appointment);
    }
    throw new Error('Patient not authorized to update this appointment');
  }

  async deleteAppointment(id: number): Promise<void> {
    const appointment = await this.getAppointment(id);
    appointment.status = StatusEnum.CANCELLED;
    await this.appointmentRepository.save(appointment);
    await this.appointmentRepository.softDelete(appointment.id);
  }

  async deleteAppointmentByDoctor(
    id: number,
    matricule: number,
  ): Promise<void> {
    const appointment = await this.getAppointment(id);
    if (appointment.doctor.matricule === matricule) {
      return await this.deleteAppointment(id);
    }
    throw new Error('Doctor not authorized to delete this appointment');
  }

  async deleteAppointmentByPatient(
    id: number,
    username: string,
  ): Promise<void> {
    const appointment = await this.getAppointment(id);
    if (appointment.patient.username === username) {
      return await this.deleteAppointment(id);
    }
    throw new Error('Patient not authorized to delete this appointment');
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

  async respondAppointment(
    id: number,
    status: StatusEnum,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  async completedAppointment(id: number) {
    const appointment = await this.getAppointment(id);

    try {
      const THIRTY_MINUTES = 30 * 60 * 1000;
      const currentTime = new Date().getTime();
      const appointmentTime = new Date(appointment.date).getTime();

      if (currentTime - appointmentTime >= THIRTY_MINUTES) {
        appointment.status = StatusEnum.COMPLETED;
        await this.appointmentRepository.save(appointment);
        console.log(`Appointment ${appointment.id} marked as completed.`);
      }
    } catch (error) {
      console.error('Error in appointment completion scheduler:', error);
    }
  }
}
