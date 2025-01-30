import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  frequency: number;
  @Column()
  morning: boolean;
  @Column()
  midday: boolean;
  @Column()
  night: boolean;
  @Column({ default: false })
  prescriptionRequired: boolean;
  @Column({ nullable: true })
  sideEffects: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
