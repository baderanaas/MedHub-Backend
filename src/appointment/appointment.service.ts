import { Injectable, NotFoundException } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { StatusEnum } from 'src/common/enums/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PatientService } from 'src/patient/patient.service';
import { DoctorService } from 'src/doctor/doctor.service';
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
    return this.appointmentRepository.find();
  }
  async getAppointment(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: id },
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
  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    const doctor = await this.doctorService.getDoctorById(doctorId);
    return doctor.appointments;
  }

  async addAppointment(
    date: CreateAppointmentDto,
    patientUserName: string,
    doctorMat: number,
  ): Promise<Appointment> {
    const patient =
      await this.patientService.getPatientByUserName(patientUserName);
    const doctor = await this.doctorService.getDoctorByMat(doctorMat);
    // const startRange = new Date(date);
    // const endRange = new Date(date);
    // startRange.setMinutes(startRange.getMinutes() - 45);
    // startRange.setMinutes(startRange.getMinutes() + 45);
    // const conflictAppointment = this.appointmentRepository.findOne({
    //   where: [
    //     {
    //       doctor: doctor,
    //       date: Between(startRange, endRange),
    //     },
    //   ],
    // });
    // if (conflictAppointment) {
    //   throw new BadRequestException(
    //     'An appointment already exists within 45 minutes of the requested time.',
    //   );
    // }
    const appointment = await this.appointmentRepository.create({
      ...date,
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
}
