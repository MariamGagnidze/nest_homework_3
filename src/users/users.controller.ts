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

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query() queryParams: { page: number; take: number }) {
    return this.usersService.findAll(queryParams);
  }

  @Get('count')
  async countUsers() {
    return this.usersService.countAll();
  }

  @Get('age')
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
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/delete-all')
  async deleteAllUsers() {
    return this.usersService.deleteAllUsers();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
