import {
  IsString,
  IsEmail,
  IsDate,
  IsEnum,
  IsPhoneNumber,
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

  @IsString()
  @IsNotEmpty()
  password: string;
}
