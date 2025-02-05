import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'Lastname is required' })
  @IsString({ message: 'Lastname must be a string' })
  @Length(3, 15, { message: 'Lastname must be between 3 and 15 characters' })
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Lastname must contain only letters and spaces',
  })
  lastName: string;

  @IsNotEmpty({ message: 'Firstname is required' })
  @IsString({ message: 'Firstname must be a string' })
  @Length(3, 15, { message: 'Firstname must be between 3 and 15 characters' })
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Lastname must contain only letters and spaces',
  })
  firstName: string;

  @IsNotEmpty({ message: 'Date of Birth is required' })
  @IsDateString({}, { message: 'Date of Birth must be a valid date' })
  @Type(() => Date)
  dateOfBirth: Date;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  @Length(8, 8, { message: 'Phone number must be exactly 8 characters long' })
  phone: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}
