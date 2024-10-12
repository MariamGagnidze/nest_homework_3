import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UsersService } from '../users/users.service';
import { Expense } from './schema/expense.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<Expense>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const expense =  await this.expenseModel.create({
      ...createExpenseDto,
       userId,
    });
    await expense.save();

    const user = await this.usersService.findOne(userId);
    user.expenses.push({
      name: expense.name,
      amount: expense.amount,
    });
    await user.save();

    return expense;
  }

  async findAll() {
    try {
      return await this.expenseModel.find().populate('userId', 'name email');
    } catch (error) {
      throw new Error(`Failed to retrieve expenses: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const expense = await this.expenseModel
        .findById(id)
        .populate('userId', 'name email');
      if (!expense) {
        throw new NotFoundException('Expense not found');
      }
      return expense;
    } catch (error) {
      throw new NotFoundException(`Failed to retrieve expense by ID: ${error.message}`);
    }
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expenseModel.findById(id);
    if (!expense) {
      throw new NotFoundException(`Expense not found`);
    }
    return this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, {
      new: true,
    });
  }

  async remove(id: string) {
    const expense = await this.expenseModel.findByIdAndDelete(id);
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async deleteAllExpenses(userId: string): Promise<void> {
    await this.expenseModel.deleteMany({ userId });
  }
}
