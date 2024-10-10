import { Body, Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto'; 
import { SignInDto } from './dto/sign-in.dto'; 
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/users.decorator';
import { take } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('users')
  getAllUsers(
    @Query('page') page: number = 1,
    @Query('take') take: number = 10,
  ) {
    return this.authService.getAllUsers({ page, take });
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@User() userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  @Delete('users/:id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
  
}
