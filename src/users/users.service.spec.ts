import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { ExpensesService } from '../expenses/expenses.service';

const mockUser = {
  _id: 'user123',
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com',
  expenses: [
    { name: 'Groceries', amount: 50 },
    { name: 'Utilities', amount: 100 },
  ],
};

const mockUserModel = {
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  deleteMany: jest.fn(),
  findOne: jest.fn(),
};

const mockExpensesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await service.findOne('user123');
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('user123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(model, 'create').mockResolvedValue(mockUser as any);

      const result = await service.create({
        name: mockUser.name,
        email: mockUser.email,
        age: mockUser.age,
        password: 'password',
      });
      expect(result).toEqual(mockUser);
    });
  });
});
