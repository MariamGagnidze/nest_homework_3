import { IsEmail, IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(3)
  @Max(80)
  age: number;
}
