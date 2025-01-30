/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';
import { Repository } from 'typeorm';
import { AddMedicationDto } from './dto/add-medication.dto';
import { AppointmentService } from '../appointment/appointment.service';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
    private readonly appointmentService: AppointmentService,
  ) {}

  async getMedications(): Promise<Medication[]> {
    try {
      return await this.medicationRepository.find({
        relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch medications');
    }
  }

  async getMedicationById(id: number): Promise<Medication> {
    try {
      const medication = await this.medicationRepository.findOne({
        where: { id },
        relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
      });
      if (!medication) {
        throw new BadRequestException('Medication not found');
      }
      return medication;
    } catch (error) {
      throw new BadRequestException('Failed to fetch medication');
    }
  }

  async getMedicationsByName(name: string): Promise<Medication[]> {
    try {
      const medications = await this.medicationRepository.find({
        where: { name },
        relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
      });
      if (medications.length === 0) {
        throw new BadRequestException(
          'No medications found with the given name',
        );
      }
      return medications;
    } catch (error) {
      throw new BadRequestException('Failed to fetch medications by name');
    }
  }

  async getMedicationsByPatient(username: string): Promise<Medication[]> {
    try {
      const appointments =
        await this.appointmentService.getPatientAppointment(username);
      if (appointments.length === 0) {
        throw new BadRequestException('No appointments found for the patient');
      }
      return await this.medicationRepository.find({
        where: appointments.map((appointment) => ({ appointment })),
        relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch medications by patient');
    }
  }

  async getMedicationsByDoctor(matricule: number): Promise<Medication[]> {
    try {
      const appointments =
        await this.appointmentService.getDoctorAppointments(matricule);
      if (appointments.length === 0) {
        throw new BadRequestException('No appointments found for the doctor');
      }
      return await this.medicationRepository.find({
        where: appointments.map((appointment) => ({ appointment })),
        relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch medications by doctor');
    }
  }

  async addMedication(medicationDto: AddMedicationDto): Promise<Medication> {
    try {
      const medication = this.medicationRepository.create(medicationDto);
      if (!medication) {
        throw new BadRequestException('Failed to create medication');
      }
      return await this.medicationRepository.save(medication);
    } catch (error) {
      throw new BadRequestException('Failed to add medication');
    }
  }

  async updateMedication(
    id: number,
    medicationDto: AddMedicationDto,
  ): Promise<Medication> {
    try {
      const medication = await this.medicationRepository.findOne({
        where: { id },
      });
      if (!medication) {
        throw new BadRequestException('Medication not found');
      }
      await this.medicationRepository.update(id, medicationDto);
      return await this.medicationRepository.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Failed to update medication');
    }
  }

  async deleteMedication(id: number): Promise<Medication> {
    try {
      const medication = await this.medicationRepository.findOne({
        where: { id },
      });
      if (!medication) {
        throw new BadRequestException('Medication not found');
      }
      await this.medicationRepository.softDelete(id);
      return medication;
    } catch (error) {
      throw new BadRequestException('Failed to delete medication');
    }
  }
}
