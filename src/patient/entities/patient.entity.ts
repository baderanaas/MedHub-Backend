import { Appointment } from 'src/appointment/entity/appointment.entity';
import { BloodType } from 'src/common/enums/blood-type.enum';
import { Medication } from 'src/medication/entities/medication.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Patient extends User {
  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  bloodType: BloodType;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
  @ManyToMany(() => Medication, (medication) => medication.patient, {
    eager: true,
  })
  @JoinTable()
  medications: Medication[];
}
