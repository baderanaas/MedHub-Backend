import { DoctorNote } from 'src/doctor-note/schema/doctor-note.schema';
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

  @ManyToOne(() => DoctorNote, (docNote) => docNote.medications)
  @JoinColumn({ name: 'docNote_id' })
  docNote: DoctorNote;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
