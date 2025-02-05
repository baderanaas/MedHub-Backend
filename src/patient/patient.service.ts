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
import { User } from 'src/user/entity/user.entity';
import { MedicationService } from 'src/medication/medication.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly medicationService: MedicationService,
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
    const doctor = await this.doctorRepository.findOne({
      where: { username: doctorUsername },
    });

    if (!doctor) {
      throw new NotFoundException(
        'Doctor with username ${doctorUsername} not found',
      );
    }

    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { id: doctor.id },
        status: In([StatusEnum.ACCEPTED]),
      },
      relations: ['patient'],
    });

    const patients = appointments.map((appointment) => appointment.patient);
    return [
      ...new Map(patients.map((patient) => [patient.id, patient])).values(),
    ];
  }


  async getAgeDistribution(): Promise<{ ageGroup: string; count: number }[]> {
    const ageDistribution = await this.userRepository
      .createQueryBuilder('user')
      .select(
        `CASE
          WHEN user.age < 18 THEN '0-17'
          WHEN user.age BETWEEN 18 AND 35 THEN '18-35'
          WHEN user.age BETWEEN 36 AND 50 THEN '36-50'
          ELSE '51+'
        END AS ageGroup`
      )
      .addSelect('COUNT(user.id)', 'count')
      .where('user.role = :role', { role: Role.PATIENT })
      .groupBy('ageGroup')
      .getRawMany();
  
    return ageDistribution.map((row) => ({
      ageGroup: row.agegroup,
      count: parseInt(row.count, 10),
    }));
  }
  
  

  async getGenderDistribution(): Promise<{ gender: string; count: number }[]> {
    const genderDistribution = await this.userRepository
      .createQueryBuilder('user')
      .select('user.sexe', 'gender')
      .addSelect('COUNT(user.id)', 'count')
      .where('user.role = :role', { role: Role.PATIENT }) // Filter by patient role
      .groupBy('user.sexe')
      .getRawMany();

    return genderDistribution.map((row) => ({
      gender: row.gender,
      count: parseInt(row.count, 10),
    }));
  }
  async addMedication(medName: string, userName: string): Promise<Patient> {
    const patient = await this.getPatientByUserName(userName);
    const medication =
      await this.medicationService.getMedicationByName(medName);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (!medication) {
      throw new NotFoundException(`Medication with name ${medName} not found`);
    }
    patient.medications.push(medication);
    return await this.patientRepository.save(patient);
  }
}
