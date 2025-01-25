import { IsNumber } from '@nestjs/class-validator';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Sexe } from 'src/common/enums/sexe.enum';
import { DoctorSpecialityEnum } from 'src/common/enums/speciality.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsOptional()
  dateOfBirth: Date;

  @IsEnum(Role)
  role: Role;
  @IsOptional()
  phone: string;

  @IsOptional()
  @IsNumber()
  matricule: number;

  @IsOptional()
  @IsNumber()
  speciality: DoctorSpecialityEnum;

  @IsOptional()
  @IsEnum(Sexe)
  sexe: Sexe;

  @IsString()
  @IsNotEmpty()
  password: string;
}
