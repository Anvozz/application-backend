import { IsEmail, IsNotEmpty, IsString, IsDate } from 'class-validator';
export class CreateUSerDto {
  @IsEmail()
  email: string;

  @IsString()
  tel: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsDate()
  dob: Date;
}
