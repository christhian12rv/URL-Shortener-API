import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateShortUrlDTO {
  @IsUrl()
  originalUrl: string;

  @IsString()
  shortCode: string;

  @IsNumber()
  userId?: string;
}
