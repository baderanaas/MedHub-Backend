import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorNote } from './entities/doctor-note.entity'; // ✅ Ensure correct import
import { DoctorNoteService } from './doctor-note.service';
import { DoctorNoteController } from './doctor-note.controller';
import { Medication } from '../medication/entities/medication.entity';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorNote, Medication]), // ✅ Register entities correctly
    AppointmentModule, // ✅ Ensure AppointmentModule is imported
  ],
  controllers: [DoctorNoteController],
  providers: [DoctorNoteService],
  exports: [TypeOrmModule],
})
export class DoctorNoteModule {}
