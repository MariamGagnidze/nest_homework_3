import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

const mockExpense = {
  _id: 'expense123',
  name: 'Groceries',
  amount: 50,
  description: 'Weekly grocery shopping',
  date: new Date(),
  userId: 'user123',
  save: jest.fn().mockResolvedValue(true),
};

const mockExpenseModel = {
  create: jest.fn().mockResolvedValue(mockExpense),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockUser = {
  _id: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  expenses: [],
  save: jest.fn().mockResolvedValue(true),
};

const mockUsersService = {
  findOne: jest.fn().mockResolvedValue(mockUser),
};

describe('ExpensesService', () => {
  let service: ExpensesService;
  let model: Model<Expense>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getModelToken(Expense.name),
          useValue: mockExpenseModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    model = module.get<Model<Expense>>(getModelToken(Expense.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an expense if found', async () => {
      mockExpenseModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockExpense),
      } as any);

      const result = await service.findOne('expense123');
      expect(result).toEqual(mockExpense);
    });

    it('should throw a NotFoundException if expense not found', async () => {
      mockExpenseModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('expense123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an expense and associate it with the user', async () => {
        const mockSave = jest.fn().mockResolvedValue(mockExpense);
        mockExpenseModel.create.mockResolvedValue(mockExpense);
      
        const result = await service.create('user123', {
          name: mockExpense.name,
          amount: mockExpense.amount,
          description: mockExpense.description,
          date: mockExpense.date,
        });
      
        expect(result).toEqual(mockExpense);
        expect(mockExpenseModel.create).toHaveBeenCalledWith({
          name: mockExpense.name,
          amount: mockExpense.amount,
          description: mockExpense.description,
          date: mockExpense.date,
          userId: 'user123',
        });
        expect(mockUsersService.findOne).toHaveBeenCalledWith('user123');
        expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete an expense', async () => {
      mockExpenseModel.findByIdAndDelete.mockResolvedValue(mockExpense as any);

      const result = await service.remove('expense123');
      expect(result).toEqual(mockExpense);
    });

    it('should throw a NotFoundException if expense to delete is not found', async () => {
      mockExpenseModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('expense123')).rejects.toThrow(NotFoundException);
    });
  });
});
