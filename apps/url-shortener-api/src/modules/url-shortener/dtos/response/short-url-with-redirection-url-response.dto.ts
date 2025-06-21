import { ApiProperty } from '@nestjs/swagger';

export class ShortUrlWithRedirectionUrlResponseDTO {
  @ApiProperty({
    description: 'Url original',
    example: 'https://www.google.com.br',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'Url encurtada',
    example: `${process.env.BASE_URL_SHORTENER_SERVICE_URL}/123ABC`,
  })
  shortUrl: string;
}
