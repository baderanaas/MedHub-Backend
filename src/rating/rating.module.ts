// import { forwardRef, Module } from '@nestjs/common';
// import { RatingService } from './rating.service';
// import { RatingController } from './rating.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Rating } from './schema/rating.schema';
// import { RatingSchema } from './schema/rating.schema';
// import { DoctorModule } from 'src/doctor/doctor.module';
// import { PatientModule } from 'src/patient/patient.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
//     forwardRef(() => DoctorModule),
//     forwardRef(() => PatientModule),
//   ],
//   controllers: [RatingController],
//   providers: [RatingService],
//   exports: [MongooseModule, RatingService],
// })
// export class RatingModule {}
