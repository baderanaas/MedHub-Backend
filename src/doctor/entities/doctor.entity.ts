
import { Appointment } from "src/appointment/entity/appointment.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Doctor extends User {
    @Column({unique:true})
    matricule:number;
    @Column()
    specialite:string;
    @OneToMany(()=>Appointment,(appointment)=>appointment.doctor)
    appointments:Appointment[];
    


}