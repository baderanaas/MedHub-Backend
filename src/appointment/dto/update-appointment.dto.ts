import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { IsFutureDate } from 'src/common/validators/is-future-date.validator';

export class UpdateAppointmentDto {
  @IsISO8601()
  @IsOptional()
  date?: Date;

  @IsEnum(StatusEnum)
  @ValidateIf((o) => o.status === StatusEnum.CANCELLED)
  @IsOptional()
  status?: StatusEnum;

  @IsInt()
  @IsOptional()
  @ValidateIf(() => false)
  patientId?: number;

  @IsInt()
  @IsOptional()
  @ValidateIf(() => false)
  doctorId?: number;
  @IsFutureDate({
    message: 'The appointment date must be after the current date and time',
  })
  @Type(() => Date)
  date: Date;
  @IsOptional()
  @IsBoolean()
  payed:boolean
}
