import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
  Res,
} from '@nestjs/common';
import { UrlShortenerService } from '../services/url-shortener.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentAuthenticatedAuthJwtPayload } from '@repo/shared/modules/jwt/decorators/current-authenticated-user.decorator';
import { CreateShortUrlRequestDTO } from '../../dtos/request/create-short-url-request.dto';
import { UpdateShortUrlRequestDTO } from '../../dtos/request/update-short-url-request.dto';
import { AuthJwtPayloadDTO } from '@repo/shared/modules/jwt/dtos/auth-jwt-payload.dto';

@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private urlShortenerService: UrlShortenerService) {}

  @Post()
  async createShortUrl(
    @Body() dto: CreateShortUrlRequestDTO,
    @CurrentAuthenticatedAuthJwtPayload() authJwtPayloadDTO?: AuthJwtPayloadDTO,
  ) {
    return this.urlShortenerService.createShortUrl(dto, authJwtPayloadDTO?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserUrls(@Req() req: Request & { user: { userId: string } }) {
    return this.urlShortenerService.getUserUrls(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUrl(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string } },
    @Body() updateShortUrlRequestDTO: UpdateShortUrlRequestDTO,
  ) {
    return this.urlShortenerService.updateUrl(
      id,
      req.user.userId,
      updateShortUrlRequestDTO,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUrl(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.urlShortenerService.deleteUrl(id, req.user.userId);
  }
}
