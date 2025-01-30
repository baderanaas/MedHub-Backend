import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsISO8601()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  session: number;
}

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
