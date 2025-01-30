import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsISO8601,
} from 'class-validator';

export class UpdateMedicationDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsISO8601()
  startDate: Date;

  @IsOptional()
  @IsNumber()
  frequency: number;

  @IsOptional()
  @IsBoolean()
  morning: boolean;

  @IsOptional()
  @IsBoolean()
  midday: boolean;

  @IsOptional()
  @IsBoolean()
  night: boolean;

  @IsOptional()
  @IsNumber()
  appointmentId: number;
}
