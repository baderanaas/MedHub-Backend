import { Appointment } from 'src/appointment/entity/appointment.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, OneToMany } from 'typeorm';

export class PatientEntity extends UserEntity {
  @Column({ nullable: true })
  medicalHistory: string;

  @Column()
  @OneToMany(() => Appointment, (appointment) => appointment.id)
  appointments: Appointment[];
}
