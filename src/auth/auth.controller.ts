import { Body, Controller, Get, Post, Delete, Param, Query, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto'; 
import { SignInDto } from './dto/sign-in.dto'; 
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/users.decorator';
import { take } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'User sign-up' })
  @ApiOkResponse({ description: 'User registered successfully.' })
  @ApiBadRequestResponse({ description: 'User already exists.' })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'User sign-in' })
  @ApiOkResponse({ description: 'User signed in successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid credentials.' })
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
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ description: 'Current user returned successfully.' })
  getCurrentUser(@User() userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  
  @Patch('users/:id')
@UseGuards(AuthGuard)
updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
}

@Delete('users/:id')
@UseGuards(AuthGuard)
removeUser(@Param('id') id: string) {
    return this.authService.removeUser(id);
}
}
