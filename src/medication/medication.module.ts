import { Module } from '@nestjs/common';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Medication]), AppointmentModule],
  controllers: [MedicationController],
  providers: [MedicationService],
})
export class MedicationModule {}
