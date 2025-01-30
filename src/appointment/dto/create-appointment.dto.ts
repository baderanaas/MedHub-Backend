import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsISO8601()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  session: number;
}


