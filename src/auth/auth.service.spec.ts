import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';

jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user is not found on sign-in', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    const dto: SignInDto = {
      email: 'wrong@example.com',
      password: 'password123',
      rememberMe: false,
    };

    await expect(service.signIn(dto)).rejects.toThrow(BadRequestException);
  });

  it('should sign in the user with correct credentials', async () => {
    const mockUser = { _id: 'user123', password: 'password123' };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('test-token');
  
    const dto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    };
  
    const result = await service.signIn(dto);
    expect(result).toEqual({ accessToken: 'test-token' });
  });
  
});
