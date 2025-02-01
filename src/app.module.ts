import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment/entity/appointment.entity';
import { AppointmentModule } from './appointment/appointment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AuthModule } from './auth/auth.module';
import { DoctorNoteModule } from './doctor-note/doctor-note.module';
import { Patient } from './patient/entities/patient.entity';
import { Doctor } from './doctor/entities/doctor.entity';
import { MedicationModule } from './medication/medication.module';
import { Medication } from './medication/entities/medication.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASS'),
        database: configService.get<string>('POSTGRES_DB'),
        synchronize: true,
        entities: [Appointment, Patient, Doctor, Medication],
        autoLoadEntities: true,
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    AppointmentModule,
    UserModule,
    PatientModule,
    DoctorModule,
    AuthModule,
    DoctorNoteModule,
    MedicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
