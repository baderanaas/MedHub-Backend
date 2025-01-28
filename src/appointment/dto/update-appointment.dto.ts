import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsISO8601, IsEnum, IsInt, ValidateIf } from 'class-validator';
import { IsFutureDate } from 'src/common/validators/is-future-date.validator';
import { StatusEnum } from 'src/common/enums/status.enum';

export class UpdateAppointmentDto {
  @IsISO8601()
  @IsOptional()
  @IsFutureDate({
    message: 'The appointment date must be after the current date and time',
  })
  @Type(() => Date)
  date?: Date;

  @IsEnum(StatusEnum)
  @ValidateIf((o) => o.status === StatusEnum.CANCELLED)
  @IsOptional()
  status?: StatusEnum;

  // @IsInt()
  // @IsOptional()
  // @ValidateIf(() => false)
  // doctorId?: number;
  // @IsFutureDate({
  //   message: 'The appointment date must be after the current date and time',
  // })

  @IsOptional()
  @IsBoolean()
  payed:boolean
}
