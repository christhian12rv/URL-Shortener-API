import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../../dtos/request/register-request.dto';
import { LoginRequestDTO } from '../../dtos/request/login-request.dto';
import { LoginResponseDTO } from '../../dtos/response/login-response.dto';
import { RegisterResponseDTO } from '../../dtos/response/register-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registro de usuário' })
  @ApiResponse({
    status: 201,
    description: 'Registro feito com sucesso',
    type: RegisterResponseDTO,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um usuário com o endereço de email informado',
  })
  @Post('register')
  async register(
    @Body() registerRequestDTO: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    return await this.authService.register(registerRequestDTO);
  }

  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login feito com sucesso',
    type: LoginResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais de login inválidas',
  })
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginRequestDTO: LoginRequestDTO,
  ): Promise<LoginResponseDTO> {
    return await this.authService.login(loginRequestDTO);
  }
}
