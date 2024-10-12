import { ExpenseSchema } from './schema/expense.schema';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from './expenses.service';
import { Expense } from './schema/expense.schema';
import { UsersModule } from '../users/users.module';
import { ExpensesController } from './expenses.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [ExpensesService],
  controllers: [ExpensesController],

  exports: [ExpensesService, MongooseModule],
})
export class ExpensesModule {}
