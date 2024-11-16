import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsEmail,
  Length,
  ValidateIf,
  Matches,
} from 'class-validator';
import { DoctorSpecialityEnum } from 'src/enums/speciality.enum';
import { Type } from 'class-transformer';
import { ValidateAgeConstraint } from 'src/common/validators/validate-age.constraint';
import { Validate } from '@nestjs/class-validator';
import { differenceInYears } from 'date-fns';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString({ message: 'Lastname must be a string' })
  @Length(3, 15, { message: 'Lastname must be between 3 and 15 characters' })
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Lastname must contain only letters and spaces',
  })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Firstname must be a string' })
  @Length(3, 15, { message: 'Firstname must be between 3 and 15 characters' })
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Lastname must contain only letters and spaces',
  })
  firstName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of Birth must be a valid date' })
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(DoctorSpecialityEnum, {
    message: 'Speciality must be a valid DoctorSpecialityEnum value',
  })
  speciality?: DoctorSpecialityEnum;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Length(8, 8, { message: 'Phone number must be exactly 8 characters long' })
  phone?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Matricule must be a number' })
  matricule?: number;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @ValidateIf((o) => o.dateOfBirth)
  @IsDateString({}, { message: 'Date of Birth must be a valid date' })
  @Validate(ValidateAgeConstraint, [{ minAge: 25, maxAge: 80 }])
  validateAge() {
    if (this.dateOfBirth) {
      const currentDate = new Date();
      const age = differenceInYears(currentDate, this.dateOfBirth);
      return age >= 25 && age <= 80;
    }
    return true;
  }
}
