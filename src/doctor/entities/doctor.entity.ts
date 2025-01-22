import { Appointment } from 'src/appointment/entity/appointment.entity';
import { DoctorSpecialityEnum } from 'src/common/enums/speciality.enum';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Doctor extends User {
  @Column({ unique: true})
  
  matricule: number;

  @Column({
    type: 'enum',
    enum: DoctorSpecialityEnum,
    default: DoctorSpecialityEnum.GENERALIST,
  })
  speciality: DoctorSpecialityEnum;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
