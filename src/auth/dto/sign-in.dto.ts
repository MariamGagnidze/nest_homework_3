import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class SignInDto{
    @IsNotEmpty()
    @IsEmail()
    @Transform(({value}) =>  value.toLowerCase())
    email: string

    @IsNotEmpty()
    @Length(4, 20)
    password: string;

    rememberMe
}