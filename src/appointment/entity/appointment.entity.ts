import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from 'src/enums/status.enum';
import { DoctorEntity } from 'src/doctor/entity/doctor.entity';
import { PatientEntity } from 'src/patient/entity/patient.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.PENDING })
  status: StatusEnum;

  @Column()
  date: Date;

  @Column()
  @ManyToOne(() => PatientEntity, (patient) => patient.id)
  patient: PatientEntity;

  @Column()
  @ManyToOne(() => DoctorEntity, (doctor) => doctor.id)
  doctor: DoctorEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
