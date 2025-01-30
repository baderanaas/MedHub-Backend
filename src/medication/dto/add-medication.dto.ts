import { IsOptional } from 'class-validator';


export class AddMedicationDto {
  @IsOptional()
  name: string;
  @IsOptional()
  frequency: number;
  @IsOptional()
  morning: boolean;
  @IsOptional()
  midday: boolean;
  @IsOptional()
  night: boolean;
  
}
