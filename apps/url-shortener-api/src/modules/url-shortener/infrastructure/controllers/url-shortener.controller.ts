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
import { ShortUrlWithRedirectionUrlResponseDTO } from '../../dtos/response/short-url-with-redirection-url-response.dto';
import { ShortUrlEntity } from '@repo/shared/modules/short-url/entities/short-url.entity';
import { RequestWithUser } from '@repo/shared/dtos/request-with-user.dto';
import { DeleteUrlResponseDTO } from '../../dtos/response/delete-url-response.dto';

@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private urlShortenerService: UrlShortenerService) {}

  @Post()
  async createShortUrl(
    @Body() createShortUrlRequestDTO: CreateShortUrlRequestDTO,
    @CurrentAuthenticatedAuthJwtPayload() authJwtPayloadDTO?: AuthJwtPayloadDTO,
  ): Promise<ShortUrlWithRedirectionUrlResponseDTO> {
    return await this.urlShortenerService.createShortUrl(
      createShortUrlRequestDTO,
      authJwtPayloadDTO?.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserUrls(@Req() req: RequestWithUser): Promise<ShortUrlEntity[]> {
    return await this.urlShortenerService.getUserUrls(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUrl(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() updateShortUrlRequestDTO: UpdateShortUrlRequestDTO,
  ): Promise<ShortUrlEntity> {
    return await this.urlShortenerService.updateUrl(
      id,
      req.user.userId,
      updateShortUrlRequestDTO,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUrl(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<DeleteUrlResponseDTO> {
    return await this.urlShortenerService.deleteUrl(id, req.user.userId);
  }
}
