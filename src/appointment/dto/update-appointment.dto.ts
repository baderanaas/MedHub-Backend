import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { IsFutureDate } from 'src/common/validators/is-future-date.validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsFutureDate({
    message: 'The appointment date must be after the current date and time',
  })
  @Type(() => Date)
  date: Date;
  @IsOptional()
  @IsBoolean()
  payed:boolean
}
