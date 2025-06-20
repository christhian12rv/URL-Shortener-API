import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
