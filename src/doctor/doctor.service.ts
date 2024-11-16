import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(private readonly doctorRepository: Repository<Doctor>) {}
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
