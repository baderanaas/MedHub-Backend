import { PatientEntity } from 'src/patient/entity/patient.entity';
import { Column } from 'typeorm';

export class DoctorEntity extends PatientEntity {
  @Column()
  certifId: string;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  experienceYears: number;
}
