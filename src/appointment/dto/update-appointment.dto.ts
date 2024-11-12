import { IsOptional } from '@nestjs/class-validator';
import { StatusEnum } from 'src/enums/status.enum';

export class UpdateAppointment {
  @IsOptional()
  status: StatusEnum;

  @IsOptional()
  date: Date;
}
