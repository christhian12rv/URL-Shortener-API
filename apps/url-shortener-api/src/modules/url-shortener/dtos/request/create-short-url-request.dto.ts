import { IsUrl } from 'class-validator';

export class CreateShortUrlRequestDTO {
  @IsUrl()
  originalUrl: string;
}
