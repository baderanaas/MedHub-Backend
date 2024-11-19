import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Column } from 'typeorm';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
