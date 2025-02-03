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
    // @InjectRepository(Doctor)
    // private readonly patientRepository: Repository<Patient>,
  ) {}
  async getDoctors(): Promise<Doctor[]> {
    return await this.doctorRepository.find();
  }
  async getDoctorById(doctorId: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }
    return doctor;
  }
  async getDoctorByMat(matricule: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { matricule: matricule },
    });
    if (!doctor) {
      throw new NotFoundException(
        `Doctor with Matricule "${matricule}" not found`,
      );
    }
    return doctor;
  }
  async getDoctorByName(name: string): Promise<Doctor[]> {
    const nameParts = name.trim().split(/\s+/);
    let firstName: string;
    let lastName: string;
    if (nameParts.length == 1) {
      firstName = nameParts[0];
      lastName = nameParts[0];
    } else if (nameParts.length == 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else {
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }
    const doctors = await this.doctorRepository
      .createQueryBuilder('doctor')
      .where(
        'doctor.firstName Like :firstName AND doctor.lastName Like :lastName OR ' +
          'doctor.firstName Like :lastName And doctor.firstName Like :firstName OR ' +
          'doctor.firstName Like :name OR ' +
          'doctor.lastName Like :name',
        {
          firstName: `${firstName}`,
          lastName: `${lastName}`,
          name: `${name}`,
        },
      )
      .getMany();
    console.log('doctors found :', doctors);
    return doctors;
  }

  async addDoctor() {}
  async updateDoctor() {}
  async deleteDoctor() {}


  //here
  async getDoctorByUserName(userName: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { username: userName },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }
}
