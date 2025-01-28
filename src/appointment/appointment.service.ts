import { Injectable, NotFoundException } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { StatusEnum } from 'src/common/enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

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

  async getPatientAppointment(username: string): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    console.log(patient);
    const appointments = await this.appointmentRepository.find({
      where: { patient: { username: username } },
    });

    console.log(appointments);
    if (!appointments) throw new NotFoundException('Appointment not found');
    return appointments;
  }
  async getPatientHistory(username: string): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    const appointments = await this.appointmentRepository.find({
      where: { patient: patient, date: LessThan(new Date()) },
    });
    if (!appointments) throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getPatientAppointmentsByStatus(
    username: string,
    AppStatus: string,
  ): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    if (!(AppStatus in StatusEnum)) {
      throw new Error('Invalid status');
    }
    const appointments = await this.appointmentRepository.find({
      where: { patient: patient, status: StatusEnum[AppStatus as keyof typeof StatusEnum] },
    });
    if (!appointments) throw new NotFoundException('Appointment not found');
    return appointments;
  }


  async getPatientAppointmentsUpcoming(
    username: string,
  ): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    const appointments = await this.appointmentRepository.find({
      where: {
        patient: patient,
        date: LessThan(new Date()),
        status: StatusEnum.ACCEPTED,
      },
    });
    if (!appointments) throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getPatientAppointmentsPending(
    username: string,
  ): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    const appointments = await this.appointmentRepository.find({
      where: { patient: patient, status: StatusEnum.PENDING },
    });
    if (!appointments) throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getPatientAppointmentsCancelled(
    username: string,
  ): Promise<Appointment[]> {
    const patient = await this.patientService.getPatientByUserName(username);
    const appointments = await this.appointmentRepository.find({
      where: { patient: patient, status: StatusEnum.CANCELLED },
    });
    if (!appointments) throw new NotFoundException('Appointment not found');
    return appointments;
  }

  async getDoctorAppointments(matricule: number): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorByMat(matricule);
    return doctor.appointments;
  }

  async getDoctorPendingAppointments(
    matricule: number,
  ): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorByMat(matricule);
    return this.appointmentRepository.find({
      where: { doctor: doctor, status: StatusEnum.PENDING },
    });
  }

  async getDoctorHistoryAppointments(
    matricule: number,
  ): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorByMat(matricule);
    return this.appointmentRepository.find({
      where: { doctor: doctor, date: LessThan(new Date()) },
    });
  }

  async getDoctorUpcomingAppointments(
    matricule: number,
  ): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorByMat(matricule);
    return this.appointmentRepository.find({
      where: {
        doctor: doctor,
        date: LessThan(new Date()),
        status: StatusEnum.ACCEPTED,
      },
    });
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

  async updateAppointment(
    id: number,
    data: UpdateAppointmentDto,
    userId: number,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.doctor.id === userId || appointment.patient.id === userId) {
      this.appointmentRepository.merge(appointment, data);
      return this.appointmentRepository.save(appointment);
    } else {
      throw new Error('User not authorized to update this appointment');
    }
  }

  async deleteAppointment(id: number): Promise<void> {
    const appointment = await this.getAppointment(id);
    appointment.status = StatusEnum.CANCELLED;
    await this.appointmentRepository.save(appointment);
    await this.appointmentRepository.softDelete(appointment.id);
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
