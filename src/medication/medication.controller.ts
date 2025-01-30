import { Body, Controller, Get, Post } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { Medication } from './entities/medication.entity';
import { AddMedicationDto } from './dto/add-medication.dto';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}
  @Get()
  async getMedications(): Promise<Medication[]> {
    return await this.medicationService.getMedications();
  }
  @Post()
  async addMedication(
    @Body() medicationDto: AddMedicationDto,
  ): Promise<Medication> {
    return await this.medicationService.addMedication(medicationDto);
  }
}
