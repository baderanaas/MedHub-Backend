import { Appointment } from 'src/appointment/entity/appointment.entity';
import { User } from 'src/user/entity/user.entity';
import { Entity, OneToMany} from 'typeorm';

@Entity()
export class Patient extends User {
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
