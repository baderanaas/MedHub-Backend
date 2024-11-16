import { Role } from "src/enums/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nom:string;
    @Column()
    prenom:string;
    @Column()
    age:number;
    @Column()
    role:Role;
    @Column()
    tel:number


}