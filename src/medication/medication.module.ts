import { Module } from '@nestjs/common';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';

@Module({
  controllers: [MedicationController],
  providers: [MedicationService],
  imports: [TypeOrmModule.forFeature([Medication])],
})
export class MedicationModule {}
