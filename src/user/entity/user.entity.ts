import { Role } from "src/common/enums/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName:string;
    @Column()
    lastName:string;
    @Column()
    age:number;
    @Column()
    role:Role;
    @Column()
    tel:number;


}