import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsEmail,
  Length,
  ValidateIf,
  Matches,
} from 'class-validator';
import { DoctorSpecialityEnum } from 'src/common/enums/speciality.enum';
import { Type } from 'class-transformer';
import { differenceInYears } from 'date-fns';
import { ValidateAgeConstraint } from 'src/common/validators/validate-age.constraint';
import { Validate } from '@nestjs/class-validator';
import { Sexe } from 'src/common/enums/sexe.enum';

export class CreateDoctorDto {
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

  @IsNotEmpty({ message: 'Speciality is required' })
  @IsEnum(DoctorSpecialityEnum, {
    message: 'Speciality must be a valid DoctorSpecialityEnum value',
  })
  speciality: DoctorSpecialityEnum;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  @Length(8, 8, { message: 'Phone number must be exactly 8 characters long' })
  phone: string;

  @IsNotEmpty({ message: 'Matricule is required' })
  @IsNumber({}, { message: 'Matricule must be a number' })
  matricule: number;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
  @IsNotEmpty({ message: 'Email is required' })
  @IsEnum(Sexe)
  sexe: Sexe;
  @ValidateIf((o) => o.dateOfBirth)
  @IsDateString({}, { message: 'Date of Birth must be a valid date' })
  @Validate(ValidateAgeConstraint, [{ minAge: 25, maxAge: 80 }])
  validateAge() {
    const currentDate = new Date();
    const age = differenceInYears(currentDate, this.dateOfBirth);
    return age >= 25 && age <= 80;
  }
}
