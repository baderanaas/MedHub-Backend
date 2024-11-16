import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';
import { StatusEnum } from 'src/enums/status.enum';

export class CreateAppointmentDto {
  status: StatusEnum;

  @IsNotEmpty()
  date: Date;
}
