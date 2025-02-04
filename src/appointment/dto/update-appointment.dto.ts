import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { StatusEnum } from 'src/common/enums/status.enum';
import { IsFutureDate } from 'src/common/validators/is-future-date.validator';
import { StatusEnum } from 'src/common/enums/status.enum';

export class UpdateAppointmentDto {
  // @IsOptional()
  // @IsFutureDate({
  //   message: 'The appointment date must be after the current date and time',
  // })
  // @Type(() => Date)
  // date: Date;
  @IsEnum(StatusEnum)
  @IsOptional()
  status: StatusEnum;
}
