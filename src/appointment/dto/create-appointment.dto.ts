import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  session: number; // Now allows the session field
}
