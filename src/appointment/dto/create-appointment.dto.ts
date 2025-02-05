import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';


export class CreateAppointmentDto {

  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  session: number;
}
