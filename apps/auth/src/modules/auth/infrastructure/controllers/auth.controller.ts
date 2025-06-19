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
import { RegisterDTO } from '../../dtos/register.dto';
import { LoginDTO } from '../../dtos/login.dto';
import { LoginResponseDTO } from '../../dtos/response/login-response.dto';
import { RegisterResponseDTO } from '../../dtos/response/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDTO: RegisterDTO,
  ): Promise<RegisterResponseDTO> {
    return await this.authService.register(registerDTO);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<LoginResponseDTO> {
    return await this.authService.login(loginDTO);
  }
}
