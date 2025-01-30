import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';

export class UpdateDoctorNoteDto {
  @IsOptional()
  @IsString()
  sickness?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;

  @IsOptional()
  @IsInt()
  appointmentId?: number;
}
