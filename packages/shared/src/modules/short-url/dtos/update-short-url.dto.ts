import { IsDate, IsInt, IsString, IsUrl, Min } from 'class-validator';

export class UpdateShortUrlDTO {
  @IsUrl()
  originalUrl?: string;

  @IsString()
  shortCode?: string;

  @IsInt()
  @Min(0)
  clicks?: number;

  @IsDate()
  deletedAt?: Date;
}
