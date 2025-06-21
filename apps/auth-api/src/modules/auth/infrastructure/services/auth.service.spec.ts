import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '@repo/shared/modules/user/infrastructure/repositories/user.repository';
import { PasswordService } from '@repo/shared/modules/password/infrastructure/services/password.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDTO } from '../../dtos/request/register-request.dto';
import { LoginRequestDTO } from '../../dtos/request/login-request.dto';
import { UserEntity } from '@repo/shared/modules/user/entities/user.entity';
import {
  UserWithEmailAlreadyExistsException,
  LoginInvalidCredentialsException,
} from '../../exceptions/auth.exceptions';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockUserRepository = (): jest.Mocked<Partial<UserRepository>> => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
});
const mockPasswordService = (): jest.Mocked<Partial<PasswordService>> => ({
  compare: jest.fn(),
  hash: jest.fn(),
});
const mockJwtService = (): any => ({
  signAsync: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: ReturnType<typeof mockUserRepository>;
  let passwordService: ReturnType<typeof mockPasswordService>;
  let jwtService: ReturnType<typeof mockJwtService>;

  const user = {
    id: '8b5e100f-c6ee-4bc8-8757-589ae1906090',
    email: 'johndoe@email.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as UserEntity;

  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_aQ2Ww2U';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: PasswordService, useFactory: mockPasswordService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    passwordService = module.get(PasswordService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(user.email, 'abc@123#');

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      userRepository.findByEmail.mockResolvedValue({
        password: user.password,
      } as UserEntity);

      passwordService.compare.mockResolvedValue(false);

      const result = await authService.validateUser(
        user.email,
        'wrongPassword',
      );

      expect(result).toBeNull();
    });

    it('should return user entity if credentials are valid', async () => {
      userRepository.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);

      const result = await authService.validateUser(user.email, 'abc@123#');

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.email).toBe(user.email);
    });
  });

  describe('login', () => {
    const loginRequestDTO: LoginRequestDTO = {
      email: user.email,
      password: 'abc@123#',
    };

    it('should throw if credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(authService.login(loginRequestDTO)).rejects.toBeInstanceOf(
        LoginInvalidCredentialsException,
      );
    });

    it('should return accessToken if credentials are valid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jwtService.signAsync.mockResolvedValue(accessToken);

      const result = await authService.login(loginRequestDTO);

      expect(result).toEqual({ accessToken });
    });
  });

  describe('register', () => {
    const registerRequestDTO: RegisterRequestDTO = {
      email: user.email,
      password: 'abc@123#',
    };

    it('should throw if user already exists', async () => {
      userRepository.findByEmail.mockResolvedValue(user);

      await expect(
        authService.register(registerRequestDTO),
      ).rejects.toBeInstanceOf(UserWithEmailAlreadyExistsException);
    });

    it('should create and return user if not exists', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue(user.password);

      userRepository.create.mockResolvedValue(user);

      const result = await authService.register(registerRequestDTO);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.email).toBe(registerRequestDTO.email);
    });
  });
});
