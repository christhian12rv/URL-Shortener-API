import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateShortUrlRequestDTO {
  @ApiProperty({
    description: 'Url original',
    example: 'https://www.google.com.br',
  })
  @IsUrl({}, { message: 'Url de origem inválida' })
  @IsNotEmpty({ message: 'Url de origem é obrigatória' })
  originalUrl: string;
}
