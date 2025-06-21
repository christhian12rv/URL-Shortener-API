import { Controller, Get, Param, Res } from '@nestjs/common';
import { UrlShortenerService } from '../../../url-shortener/infrastructure/services/url-shortener.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Redirecionamento')
@Controller()
export class RedirectionController {
  constructor(private urlShortenerService: UrlShortenerService) {}

  @ApiOperation({ summary: 'Redireciona para a Url encurtada' })
  @ApiResponse({
    status: 200,
    description: 'Redirecionamento feito com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Url encurtada não encontrada',
  })
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
