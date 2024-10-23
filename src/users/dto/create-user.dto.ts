import { IsEmail, IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'name', example: 'Hugo' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email address', example: 'Hugo@gmail.com' })
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(3)
  @Max(80)
  @ApiProperty({ description: 'Age', minimum: 3, maximum: 80, example: 3 })
  age: number;

  @ApiProperty({ description: 'Password', example: 'Hugo123' })
  password: string

}
