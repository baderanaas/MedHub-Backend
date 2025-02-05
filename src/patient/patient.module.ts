import { forwardRef, Module } from '@nestjs/common';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { UserModule } from 'src/user/user.module';

import { MedicationModule } from 'src/medication/medication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    forwardRef(() => AppointmentModule),
    forwardRef(() => DoctorModule),
    forwardRef(() => UserModule),
    MedicationModule
  ],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [TypeOrmModule, PatientService],
})
export class PatientModule {}