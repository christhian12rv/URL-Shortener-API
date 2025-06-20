import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../../dtos/request/register-request.dto';
import { LoginRequestDTO } from '../../dtos/request/login-request.dto';
import { LoginResponseDTO } from '../../dtos/response/login-response.dto';
import { RegisterResponseDTO } from '../../dtos/response/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerRequestDTO: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    return await this.authService.register(registerRequestDTO);
  }

  @Post('login')
  async login(
    @Body() loginRequestDTO: LoginRequestDTO,
  ): Promise<LoginResponseDTO> {
    return await this.authService.login(loginRequestDTO);
  }
}
