import { Medication } from 'src/medication/entities/medication.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MedicationService {
  getMedicationByName(name: string): Promise<Medication> {
    return this.medicationRepository.findOne({ where: { name: name } });
  }
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
  ) {}
  async getMedications(): Promise<Medication[]> {
    return await this.medicationRepository.find();
  }
  async getPatientMedications(username: string): Promise<Medication[]> {
    return await this.medicationRepository.find({
      where: {
        patient: {
          username: username,
        },
      },
    });
  }
}
