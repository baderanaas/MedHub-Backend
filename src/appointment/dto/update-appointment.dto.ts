import { IsDate, IsEnum, IsInt, IsISO8601, IsOptional, ValidateIf } from 'class-validator';
import { StatusEnum } from 'src/common/enums/status.enum';

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
}
