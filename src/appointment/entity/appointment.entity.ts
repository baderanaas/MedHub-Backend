import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from 'src/enums/status.enum';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.PENDING })
  status: StatusEnum;

  @Column()
  date: Date;

  // @ManyToOne(() => PatientEntity, (patient) => patient.appointments)
  // @JoinColumn({ name: 'patient_id' })
  // patient: PatientEntity;

  // @ManyToOne(() => DoctorEntity, (doctor) => doctor.appointments)
  // @JoinColumn({ name: 'doctor_id' })
  // doctor: DoctorEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
