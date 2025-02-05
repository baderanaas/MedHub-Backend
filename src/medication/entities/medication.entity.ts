import { Patient } from 'src/patient/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  frequency: number;
  @Column()
  morning: boolean;
  @Column()
  midday: boolean;
  @Column()
  night: boolean;
  @Column({ default: false })
  prescriptionRequired: boolean;
  @Column({ nullable: true })
  sideEffects: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
  @ManyToMany(() => Patient, (patient) => patient.medications)
  patient: Patient;
}
