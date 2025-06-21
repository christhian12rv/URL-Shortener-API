import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateShortUrlRequestDTO {
  @IsUrl({}, { message: 'Url de origem inválida' })
  @IsNotEmpty({ message: 'Url de origem é obrigatória' })
  originalUrl: string;
}
