import { IsDate, IsEnum, IsInt, IsISO8601, IsNotEmpty } from 'class-validator';
import { StatusEnum } from 'src/common/enums/status.enum';

export class CreateAppointmentDto {
  @IsISO8601()
  @IsNotEmpty()
  date: Date;

  // @IsInt()
  // @IsNotEmpty()
  // patientId: number;

  // @IsInt()
  // @IsNotEmpty()
  // doctorId: number;

  // @IsEnum(StatusEnum)
  // status: StatusEnum;
}
