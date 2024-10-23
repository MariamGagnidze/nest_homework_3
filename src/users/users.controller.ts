import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'take', required: false, description: 'Number of users per page', type: Number })
  @ApiOkResponse({ description: 'List of users returned successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  findAll(@Query() queryParams: { page: number; take: number }) {
    return this.usersService.findAll(queryParams);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total user count' })
  @ApiOkResponse({ description: 'Total user count returned successfully.' })
  async countUsers() {
    return this.usersService.countAll();
  }

  @Get('age')
  @ApiOperation({ summary: 'Find users by age' })
  @ApiQuery({ name: 'age', required: true, description: 'Age of the users to find', type: Number })
  @ApiOkResponse({ description: 'Users with the specified age returned successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid age parameter.' })
  async findByAge(@Query('age') age: number) {
    if (!age) {
      throw new BadRequestException('Age is required');
    }
    if (isNaN(age) || age < 0) {
      throw new BadRequestException('Age must be a positive number');
    }
    return this.usersService.findByAge(age);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiOkResponse({ description: 'User found and returned successfully.' })
  @ApiBadRequestResponse({ description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
