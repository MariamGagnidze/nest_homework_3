import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  date: Date;
}
