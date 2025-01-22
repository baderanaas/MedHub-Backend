import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { StatusEnum } from 'src/common/enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Patient } from 'src/patient/entities/patient.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
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

  async addAppointment(
    data: CreateAppointmentDto,
    patientId: number,
    doctorId: number,
  ): Promise<Appointment> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });

    if (!patient || !doctor) {
      throw new Error('Patient or Doctor not found');
    }
    const appointment = this.appointmentRepository.create({
      ...data,
      patient,
      doctor,
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

  async deleteAppointment(id: number, userId: number): Promise<void> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.doctor.id === userId || appointment.patient.id === userId) {
      appointment.status = StatusEnum.CANCELLED;
      await this.appointmentRepository.save(appointment);
      await this.appointmentRepository.softDelete(appointment.id);
    } else {
      throw new Error('User not authorized to delete this appointment');
    }
  }

  @Cron('*/15 * * * 1-6')
  async handleAppointmentCompletion() {
    console.debug('Checking for appointments to complete...');

    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayStart.getDate() + 1);

      const appointments = await this.appointmentRepository.find({
        where: {
          status: StatusEnum.PENDING,
          date: Between(todayStart, todayEnd),
        },
      });

      const now = Date.now();

      for (const appointment of appointments) {
        const appointmentTime = new Date(appointment.date).getTime();
        const THIRTY_MINUTES = 30 * 60 * 1000;

        if (now - appointmentTime >= THIRTY_MINUTES) {
          appointment.status = StatusEnum.COMPLETED;
          await this.appointmentRepository.save(appointment);
          console.log(`Appointment ${appointment.id} marked as completed.`);
        }
      }
    } catch (error) {
      console.error('Error in appointment completion scheduler:', error);
    }
  }
}
