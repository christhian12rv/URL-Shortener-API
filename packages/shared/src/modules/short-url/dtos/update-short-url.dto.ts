import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateShortUrlDTO {
  @ApiProperty({
    description: 'Url original',
    example: 'https://www.google.com.br',
  })
  @IsUrl({}, { message: 'Url de origem inválida' })
  @IsOptional()
  originalUrl?: string;

  @ApiProperty({
    description: 'Código da Url encurtada',
    example: '123ABC',
  })
  @IsString({ message: 'Código da Url encurtada inválido' })
  @IsOptional()
  shortCode?: string;

  @ApiProperty({
    description: 'Quantidade de cliques na Url encurtada',
    example: 22,
  })
  @IsInt({ message: 'Cliques inválido' })
  @Min(0, { message: 'Cliques deve ser no mínimo 0' })
  @Optional()
  clicks?: number;

  @ApiProperty({
    description: 'Data de exclusão da Url encurtada',
    example: '2025-05-30T13:16:40.734Z',
  })
  @IsDate({ message: 'Data de exclusão inválida' })
  @Optional()
  deletedAt?: Date;
}
