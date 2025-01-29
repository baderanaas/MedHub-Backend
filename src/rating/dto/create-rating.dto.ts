import { IsOptional, IsString, Length } from 'class-validator';
import { IsNumber } from 'class-validator';

export class CreateRatingDto {
  @IsNumber({}, { message: 'Score must be a number' })
  @Length(1, 5, { message: 'Score must be between 1 and 5' })
  score: number;

  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  comment?: string;
}
