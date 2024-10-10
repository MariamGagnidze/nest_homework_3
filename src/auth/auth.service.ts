import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';  
import { JwtService } from '@nestjs/jwt';
import { QueryParamsDto } from 'src/users/dto/queryparams.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { email, name, password, age } = createUserDto;
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (user) throw new BadRequestException('User already exists');
  
    const hashedPass = await bcrypt.hash(password, 10);
    await this.usersService.create({ email:email.toLowerCase(), name, password: hashedPass, age });
    return { success: true, message: 'User registered successfully' };
  }
  

  async signIn(signInDto: SignInDto) {
    const { email, password, rememberMe } = signInDto;
  
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user || !user.password) {
      console.error('User not found with email:', email);

      throw new BadRequestException('Invalid credentials');
    }
  
    const isPassEqual = await bcrypt.compare(password, (user as any).password);
    if (!isPassEqual) {    console.error('Password does not match for user:', email);
    throw new BadRequestException('Invalid credentials');}
  
    const payload = { sub: user._id };
    const expire = rememberMe ? '7d' : '1h';
  
    return {
      accessToken: await this.jwtService.signAsync(payload, { expiresIn: expire }),
    };
  }
  

  async getAllUsers(queryParams: QueryParamsDto) {
    return this.usersService.findAll(queryParams);
  }

  getCurrentUser(userId: string) {
    return this.usersService.findOne(userId);
  }

  async deleteUser(id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersService.remove(id);

    return { success: true, message: 'User deleted ' };
  }
}
