import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { AddAppointment } from './dto/add-appointment.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { PatientEntity } from 'src/patient/entity/patient.entity';
import { DoctorEntity } from 'src/doctor/entity/doctor.entity';
import { StatusEnum } from 'src/enums/status.enum';
import { time } from 'console';
import { CrudService } from 'src/common/services/crud.service';
import { where } from 'sequelize';

@Injectable()
export class AppointmentService extends CrudService<Appointment>{
  constructor(private appointmentRepository: Repository<Appointment>) {
    super(appointmentRepository)
  }

  async getDocAppointments(doctorId:number):Promise<Appointment[]>{
    return this.appointmentRepository.find({where:{
        doctor:{id:doctorId}
    }})
  }
  async getPatientAppointments(patientId:number):Promise<Appointment[]>{
    return this.appointmentRepository.find({where:{
        patient:{id:patientId}
    }})
  }

  async getAppointments(): Promise<Appointment[]> {
   
      return this.appointmentRepository.find();
    
  }

  async getAppointment(id: number, user?: UserEntity): Promise<Appointment> {
    try {
      if (this.isDoctor(user)) {
        return this.appointmentRepository.findOne({
          where: { id: id, doctor: user },
        });
      } else if (this.isPatient(user)) {
        return this.appointmentRepository.findOne({
          where: { id: id, patient: user },
        });
      }
      return this.appointmentRepository.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Appointment not found');
    }
  }

  async createAppointment(
    user: UserEntity,
    data: AddAppointment,
  ): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(data);

    if (this.isDoctor(user, appointment) || this.isPatient(user, appointment)) {
      return this.appointmentRepository.save(appointment);
    } else {
      throw new ForbiddenException(
        'User is not authorized to create this appointment',
      );
    }
  }

  async updateAppointment(
    id: number,
    data: Partial<AddAppointment>,
    user: UserEntity,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id, user);
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (
      !(this.isDoctor(user, appointment) || this.isPatient(user, appointment))
    )
      throw new UnauthorizedException(
        'You are not authorized to update this appointment',
      );
    Object.assign(appointment, data);
    return this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(id: number, user: UserEntity): Promise<void> {
    const appointment = await this.getAppointment(id, user);
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (
      !this.isDoctor(user, appointment) ||
      !this.isPatient(user, appointment) ||
      !this.isAdmin(user)
    )
      throw new UnauthorizedException(
        'You are not authorized to delete this appointment',
      );
    appointment.status = StatusEnum.CANCELLED;
    await this.appointmentRepository.save(appointment);
    await this.appointmentRepository.softDelete(appointment);
  }

  async respondAppointment(
    id: number,
    doctor: DoctorEntity,
    status: StatusEnum,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id, doctor);
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.status = status;
    await this.appointmentRepository.save(appointment);

    if (status === StatusEnum.ACCEPTED) {
      const appointments = await this.getDocAppointments(doctor.id);
      for (const appm of appointments) {
        if (appm.id !== id && appm.status === StatusEnum.PENDING) {
          appm.status = StatusEnum.REJECTED;
          await this.appointmentRepository.save(appm);
        }
      }
    }

    return appointment;
  }

  async cancelAppointment(id: number, user: UserEntity) {
    if (this.isAdmin(user)) {
      throw new UnauthorizedException(
        'You are not authorized to cancel this appointment',
      );
    }
    const appointment = await this.getAppointment(id, user);
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.status = StatusEnum.CANCELLED;
    await this.appointmentRepository.save(appointment);
    return { appointment, user };
  }

  async completedAppointment(id: number): Promise<Appointment> {
    const appointment = await this.getAppointment(id);

    if (!appointment) throw new NotFoundException('Appointment not found');

    const THIRTY_MINUTES = 30 * 60 * 1000;
    const currentTime = new Date().getTime();
    const appointmentTime = new Date(appointment.date).getTime();

    if (currentTime - appointmentTime > THIRTY_MINUTES) {
      appointment.status = StatusEnum.COMPLETED;
      await this.appointmentRepository.save(appointment); // Save the updated status
    }

    return appointment;
  }

  isAdmin(user: UserEntity): boolean {
    return !(user instanceof PatientEntity) && !(user instanceof DoctorEntity);
  }

  isDoctor(user: UserEntity, appointment?: Appointment): boolean {
    if (appointment) {
      return appointment.doctor && appointment.doctor.id === user.id;
    }
    return user.id === appointment.doctor.id;
  }

  isPatient(user: UserEntity, appointment?: Appointment): boolean {
    if (appointment) {
      return appointment.patient && appointment.patient.id === user.id;
    }
    return user.id === appointment.patient.id;
  }
}
