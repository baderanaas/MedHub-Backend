import { IsDate, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { StatusEnum } from 'src/common/enums/status.enum';

export class CreateAppointmentDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsEnum(StatusEnum)
  status: StatusEnum;
}
