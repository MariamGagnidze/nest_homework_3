import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() queryParams: { page: number; take: number }) {
    return this.usersService.findAll(queryParams);
  }

  @Get('count')
  async countUsers() {
    const count = await this.usersService.countAll();
    return { totalUsers: count };
  }

  @Get('age')
  async findByAge(
    @Query('age') age: number,
    @Query('ageFrom') ageFrom: number,
    @Query('ageTo') ageTo: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.usersService.findByAge(age, ageFrom, ageTo, page, limit);
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
