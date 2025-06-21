import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@repo/shared/modules/user/infrastructure/repositories/user.repository';
import { PasswordService } from '@repo/shared/modules/password/infrastructure/services/password.service';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { RegisterRequestDTO } from '../../dtos/request/register-request.dto';
import { LoginRequestDTO } from '../../dtos/request/login-request.dto';
import { LoginResponseDTO } from '../../dtos/response/login-response.dto';
import { UserEntity } from '@repo/shared/modules/user/entities/user.entity';
import { RegisterResponseDTO } from '../../dtos/response/register-response.dto';
import {
  LoginInvalidCredentialsException,
  UserWithEmailAlreadyExistsException,
} from '../../exceptions/auth.exceptions';
import { AuthJwtPayloadDTO } from '@repo/shared/modules/jwt/dtos/auth-jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordCompareResult = await this.passwordService.compare(
      password,
      user.password,
    );

    if (!passwordCompareResult) {
      return null;
    }

    return plainToInstance(UserEntity, user);
  }

  async login(loginRequest: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.validateUser(
      loginRequest.email,
      loginRequest.password,
    );

    if (!user) {
      throw new LoginInvalidCredentialsException();
    }

    const authJwtPayload: AuthJwtPayloadDTO = {
      email: user.email,
      sub: user.id,
    };

    return {
      accessToken: await this.jwtService.signAsync(authJwtPayload),
    };
  }

  async register(
    registerRequestDTO: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(
      registerRequestDTO.email,
    );

    if (existingUser) {
      throw new UserWithEmailAlreadyExistsException();
    }

    const hashedPassword = await this.passwordService.hash(
      registerRequestDTO.password,
    );

    const user = await this.userRepository.create({
      ...registerRequestDTO,
      password: hashedPassword,
    });

    return plainToInstance(UserEntity, user);
  }
}
