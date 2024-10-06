import { ExpenseSchema } from './schema/expense.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from './expenses.service';
import { Expense } from './schema/expense.schema';
import { UsersModule } from 'src/users/users.module';
import { ExpensesController } from './expenses.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    UsersModule,
  ],
  providers: [ExpensesService],
  controllers: [ExpensesController],

  exports: [ExpensesService],
})
export class ExpensesModule {}
