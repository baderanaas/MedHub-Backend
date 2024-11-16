import { Appointment } from "src/appointment/entity/appointment.entity";
import { Role } from "src/enums/role.enum";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Patient extends User {
   
    @OneToMany(()=>Appointment,(appointment)=>appointment.patient)
    appointments:Appointment[];




}