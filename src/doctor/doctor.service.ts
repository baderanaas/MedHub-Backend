import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patient/entities/patient.entity';


@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Doctor) private readonly patientRepository:Repository<Patient>
  ) {}
  async getDoctors() {}
  async getDoctorById(doctorId: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }
    return doctor;
  }

  async addDoctor() {}
  async updateDoctor() {}
  async deleteDoctor() {}
}
