import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Role } from 'src/common/enums/role.enum';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { differenceInYears } from 'date-fns';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { StatusEnum } from 'src/common/enums/status.enum';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getPatients(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async getPatientByUserName(userName: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { username: userName },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async getPatientsByDoctor(doctorId: number): Promise<Patient[]> {
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { id: doctorId },
        status: StatusEnum.COMPLETED,
      },
      relations: ['patient'],
    });

    const patients = appointments.map((appointment) => appointment.patient);
    return [
      ...new Map(patients.map((patient) => [patient.id, patient])).values(),
    ];
  }

  async addPatient(patientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...patientDto,
      role: Role.PATIENT,
      age: differenceInYears(new Date(), patientDto.dateOfBirth),
    });
    return this.patientRepository.save(patient);
  }

  async updatePatient(
    patientDto: UpdatePatientDto,
    userName: string,
  ): Promise<Patient> {
    const patient = await this.getPatientByUserName(userName);
    if (patientDto.dateOfBirth) {
      const currentDate = new Date();
      const age = differenceInYears(currentDate, patientDto.dateOfBirth);
      patient.age = age;
    }
    this.patientRepository.merge(patient, patientDto);
    return this.patientRepository.save(patient);
  }

  async deletePatient(userName: string): Promise<void> {
    const patient = await this.getPatientByUserName(userName);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    await this.patientRepository.softDelete(patient.id);
  }
}
