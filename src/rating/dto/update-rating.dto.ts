import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateRatingDto {
  @IsOptional()
  @IsNumber({}, { message: 'Score must be a number' })
  @Length(1, 5, { message: 'Score must be between 1 and 5' })
  score: number;

  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  comment?: string;
}
