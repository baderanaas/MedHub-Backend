import { IsOptional } from '@nestjs/class-validator';

export class UpdateRatingDto {
  @IsOptional()
  score: number;

  @IsOptional()
  comment;
}
