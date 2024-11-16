import { Injectable, NotFoundException, Delete } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Role } from 'src/common/enums/role.enum';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { differenceInYears } from 'date-fns';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async getPatients(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async getPatientById(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id: id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
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
    id: number,
  ): Promise<Patient> {
    const patient = await this.getPatientById(id);
    if (patientDto.dateOfBirth) {
      const currentDate = new Date();
      const age = differenceInYears(currentDate, patientDto.dateOfBirth);
      patient.age = age;
    }
    this.patientRepository.merge(patient, patientDto);
    return this.patientRepository.save(patient);
  }

  async deletePatient(id: number): Promise<void> {
    const patient = await this.getPatientById(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    await this.patientRepository.softDelete(id);
  }
}
