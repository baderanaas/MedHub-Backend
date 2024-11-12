import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class AddUser {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  // @IsNotEmpty()
  // @IsString()
  // password: string;

  // @IsNotEmpty()
  // @IsString()
  // salt: string;
}
