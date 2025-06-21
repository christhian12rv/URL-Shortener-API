import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateShortUrlDTO {
  @ApiProperty({
    description: 'Url original',
    example: 'https://www.google.com.br',
  })
  @IsUrl({}, { message: 'Url de origem inválida' })
  @IsNotEmpty({ message: 'Url de origem é obrigatória' })
  originalUrl: string;

  @ApiProperty({
    description: 'Código da Url encurtada',
    example: '123ABC',
  })
  @IsString({ message: 'Código da Url encurtada inválido' })
  @IsNotEmpty({ message: 'Código da Url encurtada é obrigatório' })
  shortCode: string;

  @ApiProperty({
    description: 'Id do usúario',
    example: '38666be4-43fb-46d0-82df-c75673c13114',
  })
  @IsNumber({}, { message: 'ID do usuário inválido' })
  @IsOptional()
  userId?: string;
}
