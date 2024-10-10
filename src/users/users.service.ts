import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamsDto } from './dto/queryparams.dto';
import { Expense } from 'src/expenses/schema/expense.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async onModuleInit() {
    console.log('onModuleInit triggered');
    await this.seedUsers();
  }

  async seedUsers() {
    const userCount = await this.userModel.countDocuments();

    if (userCount === 0) {
      const users = new Set<string>();

      while (users.size < 10) {
        const user = {
          name: faker.person.firstName(),
          email: faker.internet.email(),
          age: faker.number.int({ min: 3, max: 80 }),
        };

        if (
          !Array.from(users).some((u) => JSON.parse(u).email === user.email)
        ) {
          users.add(JSON.stringify(user));
        }
      }

      const usersArray = [...users].map((user) => JSON.parse(user));

      await this.userModel.insertMany(usersArray);
      console.log('Added 10 users');
    } else {
      console.log('Users already exist, seeding skipped');
    }
  }

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findAll(queryParams: QueryParamsDto) {
    let { page, take } = queryParams;

    take = take > 100 ? 100 : take;

    return this.userModel
      .find()
      .skip((page - 1) * take)
      .limit(take)
      .populate('expenses', 'name amount');
  }

  async countAll() {
    const totalUsers = await this.userModel.countDocuments();
    return { totalUsers };
  }

  async findByAge(age: number) {
    return this.userModel.find({ age });
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).populate('expenses');
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async deleteAllUsers() {
    await this.userModel.deleteMany({});
    return { message: 'All users have been deleted' };
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    await this.userModel.findByIdAndDelete(id);

    return { success: true, message: 'User deleted' };
  }
}
