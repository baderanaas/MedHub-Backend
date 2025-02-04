import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Role } from 'src/common/enums/role.enum';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { differenceInYears } from 'date-fns';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { StatusEnum } from 'src/common/enums/status.enum';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
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

  async getPatientsByDoctorUsername(doctorUsername: string): Promise<Patient[]> {
    // Find the doctor entity by username
    const doctor = await this.doctorRepository.findOne({
      where: { username: doctorUsername },
    });
  
    if (!doctor) {
      throw new NotFoundException(`Doctor with username ${doctorUsername} not found`);
    }
  
    // Fetch appointments of this doctor with ACCEPTED and COMPLETED statuses
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { id: doctor.id }, // Now using the doctor's ID after fetching it via username
        status: In([StatusEnum.COMPLETED, StatusEnum.ACCEPTED]),
      },
      relations: ['patient'],
    });
  
    // Extract unique patients
    const patients = appointments.map((appointment) => appointment.patient);
    return [...new Map(patients.map((patient) => [patient.id, patient])).values()];
  }
  


  async addPatient(patientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...patientDto,
      role: Role.PATIENT,
      age: differenceInYears(new Date(), new Date(patientDto.dateOfBirth)),
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

  async getPatientsByDoctorUsername(
    doctorUsername: string,
  ): Promise<Patient[]> {
    // Find the doctor entity by username
    const doctor = await this.doctorRepository.findOne({
      where: { username: doctorUsername },
    });

    if (!doctor) {
      throw new NotFoundException(
        'Doctor with username ${doctorUsername} not found',
      );
    }

    // Fetch appointments of this doctor with ACCEPTED and COMPLETED statuses
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { id: doctor.id }, // Now using the doctor's ID after fetching it via username
        status: In([StatusEnum.ACCEPTED]),
      },
      relations: ['patient'],
    });

    // Extract unique patients
    const patients = appointments.map((appointment) => appointment.patient);
    return [
      ...new Map(patients.map((patient) => [patient.id, patient])).values(),
    ];
  }
}
