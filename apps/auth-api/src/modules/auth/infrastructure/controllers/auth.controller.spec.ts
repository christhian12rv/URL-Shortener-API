import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';

import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../../dtos/request/register-request.dto';
import { LoginRequestDTO } from '../../dtos/request/login-request.dto';
import { RegisterResponseDTO } from '../../dtos/response/register-response.dto';
import { LoginResponseDTO } from '../../dtos/response/login-response.dto';
import {
  UserWithEmailAlreadyExistsException,
  LoginInvalidCredentialsException,
} from '../../exceptions/auth.exceptions';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_aQ2Ww2U';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    const registerRequestDTO: RegisterRequestDTO = {
      email: 'johndoe@email.com',
      password: 'abc@123#',
    };

    it('should register a user successfully', async () => {
      const registerResponseDTO: RegisterResponseDTO = {
        email: registerRequestDTO.email,
        id: '74a1e817-2e14-4784-a6fa-e63e52ba2a41',
      } as any;

      jest
        .spyOn(authService, 'register')
        .mockResolvedValue(registerResponseDTO);

      await expect(
        authController.register(registerRequestDTO),
      ).resolves.toEqual(registerResponseDTO);
      expect(authService.register).toHaveBeenCalledWith(registerRequestDTO);
    });

    it('should throw if user already exists', async () => {
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new UserWithEmailAlreadyExistsException());

      await expect(
        authController.register(registerRequestDTO),
      ).rejects.toBeInstanceOf(UserWithEmailAlreadyExistsException);
    });
  });

  describe('login', () => {
    const loginRequestDTO: LoginRequestDTO = {
      email: 'johndoe@email.com',
      password: 'abc@123#',
    };

    it('should login successfully', async () => {
      const result: LoginResponseDTO = {
        accessToken,
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      await expect(authController.login(loginRequestDTO)).resolves.toEqual(
        result,
      );
      expect(authService.login).toHaveBeenCalledWith(loginRequestDTO);
    });

    it('should throw if credentials are invalid', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new LoginInvalidCredentialsException());

      await expect(
        authController.login(loginRequestDTO),
      ).rejects.toBeInstanceOf(LoginInvalidCredentialsException);
    });
  });
});
