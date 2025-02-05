import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsISO8601,
} from 'class-validator';

export class AddMedicationDto {
  @IsString()
  name: string;

  @IsISO8601()
  startDate: Date;

  @IsOptional()
  @IsNumber()
  frequency: number = -1;

  @IsOptional()
  @IsBoolean()
  morning: boolean = false;

  @IsOptional()
  @IsBoolean()
  midday: boolean = false;

  @IsOptional()
  night: boolean;
}
