import { Controller, Get, Param, Res } from '@nestjs/common';
import { UrlShortenerService } from './modules/url-shortener/infrastructure/services/url-shortener.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private urlShortenerService: UrlShortenerService) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() response: Response,
  ): Promise<void> {
    const originalUrl =
      await this.urlShortenerService.getOriginalUrl(shortCode);

    response.redirect(originalUrl);
  }
}
