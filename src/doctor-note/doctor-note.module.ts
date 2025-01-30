import { forwardRef, Module } from '@nestjs/common';
import { DoctorNoteService } from './doctor-note.service';
import { DoctorNoteController } from './doctor-note.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorNote, DoctorNoteSchema } from './schema/doctor-note.schema';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorNote.name, schema: DoctorNoteSchema },
    ]),
    forwardRef(() => AppointmentModule),
  ],
  controllers: [DoctorNoteController],
  providers: [DoctorNoteService],
  exports: [MongooseModule, DoctorNoteService],
})
export class DoctorNoteModule {}
