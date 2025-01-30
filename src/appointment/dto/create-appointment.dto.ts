// import { IsNotEmpty } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
// import { IsFutureDate } from 'src/common/validators/is-future-date.validator';

export class CreateAppointmentDto {
  // @IsNotEmpty()
  // @IsFutureDate({
  //   message: 'The appointment date must be after the current date and time',
  // })
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;
  @IsNumber()
  @IsNotEmpty()
  session: number;
}
