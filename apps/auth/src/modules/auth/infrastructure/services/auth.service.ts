import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@repo/shared/modules/user/infrastructure/repositories/user.repository';
import { PasswordService } from '@repo/shared/modules/password/infrastructure/services/password.service';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { RegisterDTO } from '../../dtos/register.dto';
import { LoginDTO } from '../../dtos/login.dto';
import { LoginResponseDTO } from '../../dtos/response/login-response.dto';
import { UserEntity } from '@repo/shared/modules/user/entities/user.entity';
import { RegisterResponseDTO } from '../../dtos/response/register-response.dto';

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

  async login(loginDTO: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.validateUser(loginDTO.email, loginDTO.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    console.log(payload);

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerDTO: RegisterDTO): Promise<RegisterResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(
      registerDTO.email,
    );

    if (existingUser) {
      throw new UnauthorizedException(
        `User with email ${registerDTO.email} already exists`,
      );
    }

    const hashedPassword = await this.passwordService.hash(
      registerDTO.password,
    );

    const user = await this.userRepository.create({
      ...registerDTO,
      password: hashedPassword,
    });

    return plainToInstance(UserEntity, user);
  }
}
