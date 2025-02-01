import { Appointment } from 'src/appointment/entity/appointment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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
  @Column()
  dose:string;

  @ManyToOne(() => Appointment, (appointment) => appointment.medications)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
