import { IsOptional } from 'class-validator';

export class AvailableSessionsDto {
  @IsOptional()
  username: string;

  @IsOptional()
  date: string;
}
