import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { StatusEnum } from 'src/enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
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

  async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(data);

    return this.appointmentRepository.save(appointment);
  }

  async updateAppointment(
    id: number,
    data: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    Object.assign(appointment, data);
    return this.appointmentRepository.save(appointment);
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
    await this.appointmentRepository.save(appointment);

    if (status === StatusEnum.ACCEPTED) {
      const appointments = await this.getAppointments();
      for (const appm of appointments) {
        if (appm.id !== id && appm.status === StatusEnum.PENDING) {
          appm.status = StatusEnum.REJECTED;
          await this.appointmentRepository.save(appm);
        }
      }
    }

    return appointment;
  }

  async cancelAppointment(id: number) {
    const appointment = await this.getAppointment(id);

    appointment.status = StatusEnum.CANCELLED;
    await this.appointmentRepository.save(appointment);
    return appointment;
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
}
