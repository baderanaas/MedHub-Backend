import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';
import { StatusEnum } from 'src/enums/status.enum';

export class CreateAppointmentDto {
  status: StatusEnum;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  createdAt: Date;
}
