import { Controller, Get, Param } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { Medication } from './entities/medication.entity';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}
  @Get('patient/:username')
  async getPatientMedications(@Param('username') username: string) {
    return this.medicationService.getPatientMedications(username);
  }
  @Get(':id')
  async getMedicationByName(@Param('id') name): Promise<Medication> {
    return await this.medicationService.getMedicationByName(name);
  }
  @Get()
  async getMedications(): Promise<Medication[]> {
    return await this.medicationService.getMedications();
  }
}
