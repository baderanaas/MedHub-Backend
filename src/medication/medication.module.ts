import { Module } from '@nestjs/common';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medication]), // ✅ Ensure Medication is registered
  ],
  controllers: [MedicationController],
  providers: [MedicationService],
  exports: [TypeOrmModule],
})
export class MedicationModule {}
