import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UserGuard } from './expense.guard';
import { Request } from 'express';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(UserGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiOkResponse({ description: 'Expense created successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid expense data.' })
  create(@Req() request: Request, @Body() createExpenseDto: CreateExpenseDto) {
    const userId = request['userId'];
    return this.expensesService.create(userId, createExpenseDto);
  }
  @Get()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'List of expenses returned successfully.' })
  findAll() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID', type: String })
  @ApiOkResponse({ description: 'Expense returned successfully.' })
  @ApiBadRequestResponse({ description: 'Expense not found.' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiParam({ name: 'id', description: 'Expense ID', type: String })
  @ApiOkResponse({ description: 'Expense updated successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid expense data or expense not found.' })
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Expense ID', type: String })
  @ApiOkResponse({ description: 'Expense deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Expense not found.' })
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
