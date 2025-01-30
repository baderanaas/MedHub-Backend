import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';

export class CreateDoctorNoteDto {
  @IsString()
  @IsNotEmpty()
  sickness: string;

  @IsString()
  @IsNotEmpty()
  prescription: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;

  @IsInt()
  @IsNotEmpty()
  appointmentId: number;
}
