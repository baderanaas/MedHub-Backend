import { IsNumber } from '@nestjs/class-validator';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';


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

  @IsString()
  @IsNotEmpty()
  password: string;
}
