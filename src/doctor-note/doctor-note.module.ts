// import { Module, forwardRef } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { DoctorNoteService } from './doctor-note.service';
// import { DoctorNoteController } from './doctor-note.controller';
// import { DoctorNote, DoctorNoteSchema } from './schema/doctor-note.schema'; // Vérifie bien le chemin du fichier
// import { AppointmentModule } from 'src/appointment/appointment.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: DoctorNote.name, schema: DoctorNoteSchema },
//     ]), // Assure-toi que le modèle est bien déclaré
//     forwardRef(() => AppointmentModule), // Résout la dépendance circulaire
//   ],
//   controllers: [DoctorNoteController],
//   providers: [DoctorNoteService],
//   exports: [DoctorNoteService], // Ajout du service dans les exports
// })
// export class DoctorNoteModule {}
