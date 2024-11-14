import { IsOptional } from '@nestjs/class-validator';

export class CreateRatingDto {
  score: number;

  @IsOptional()
  comment;
}
