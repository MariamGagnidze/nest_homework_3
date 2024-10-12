import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schema/user.schema';
import { ExpensesModule } from '../expenses/expenses.module';
import { ExpensesService } from 'src/expenses/expenses.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => ExpensesModule),
  ],
  providers: [ExpensesService, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
