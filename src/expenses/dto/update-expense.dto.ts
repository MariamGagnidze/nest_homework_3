import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
    @IsNotEmpty()
    @ApiProperty({ description: 'Name of the expense', example: 'Groceries' })
    name: string;
  
    @IsNotEmpty()
    @ApiProperty({ description: 'Description of the expense', example: 'Weekly grocery shopping' })
    description: string;
  
    @IsNumber()
    @Min(0)
    @ApiProperty({ description: 'Amount', example: 50 })
    amount: number;
}
