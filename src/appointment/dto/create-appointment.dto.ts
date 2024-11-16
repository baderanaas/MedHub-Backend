import { IsNotEmpty } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsFutureDate } from 'src/common/validators/is-future-date.validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsFutureDate({
    message: 'The appointment date must be after the current date and time',
  })
  @Type(() => Date)
  date: Date;
}
