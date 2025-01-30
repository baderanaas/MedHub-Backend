import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';
import { Repository } from 'typeorm';
import { AddMedicationDto } from './dto/add-medication.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
  ) {}
  getMedications(): Promise<Medication[]> {
    return this.medicationRepository.find();
  }
  async addMedication(medicationDto: AddMedicationDto): Promise<Medication> {
    const medication = await this.medicationRepository.create(medicationDto);
    if (medication) {
      return await this.medicationRepository.save(medication);
    } else {
      throw new BadRequestException(
        'Some thing went wrong with the creeation of medication',
      );
    }
  }
}
