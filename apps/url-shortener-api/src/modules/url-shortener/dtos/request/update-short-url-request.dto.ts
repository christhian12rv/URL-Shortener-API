import { IsUrl } from 'class-validator';

export class UpdateShortUrlRequestDTO {
  @IsUrl()
  originalUrl: string;
}
