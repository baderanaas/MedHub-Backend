import { forwardRef, Module } from '@nestjs/common';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    forwardRef(() => AppointmentModule),
  ],

  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
