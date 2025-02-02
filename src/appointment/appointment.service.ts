import { Injectable, NotFoundException } from '@nestjs/common';
import { LessThan, MoreThanOrEqual, Repository,MoreThan } from 'typeorm';
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
  // async getPatientAppointments(username: string): Promise<Appointment[]> {
  // }
  async getUpcomingAppointments(username: string): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
  
    if (!patient) {
      throw new NotFoundException(`Patient with username "${username}" not found`);
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
      throw new NotFoundException(`Patient with username "${username}" not found`);
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

  async getUpcomingDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorById(doctorId);
    console.log(doctor);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }
    const today = new Date();
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { id: doctorId },
        date: MoreThanOrEqual(today),
        status: StatusEnum.ACCEPTED,
      },
      relations: ['patient'], // Inclure les informations du patient
      order: { date: 'ASC' }, // Trier par date ascendante
    });
  
    if (!appointments.length) {
      throw new NotFoundException('No upcoming appointments found for this doctor');
    }
  
    return appointments;
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
