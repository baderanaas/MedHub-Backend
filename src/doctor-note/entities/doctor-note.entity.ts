import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Medication } from '../../medication/entities/medication.entity'; // ✅ Fix the import path

@Entity('doctor_notes')
export class DoctorNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prescription: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column()
  appointmentId: number;

  @OneToMany(() => Medication, (medication) => medication.docNote, { cascade: true })
  medications: Medication[];
}
