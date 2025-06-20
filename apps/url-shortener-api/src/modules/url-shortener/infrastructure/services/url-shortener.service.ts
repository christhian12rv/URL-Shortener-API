import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { ShortUrlNotFoundException } from '../../exceptions/url-shortener.exceptions';
import { ShortUrlRepository } from '@repo/shared/modules/short-url/infrastructure/repositories/short-url.repository';
import { CreateShortUrlRequestDTO } from '../../dtos/request/create-short-url-request.dto';
import { UpdateShortUrlRequestDTO } from '../../dtos/request/update-short-url-request.dto';
import { ShortUrlEntity } from '@repo/shared/modules/short-url/entities/short-url.entity';

@Injectable()
export class UrlShortenerService {
  constructor(
    private shortUrlRepository: ShortUrlRepository,
    private configService: ConfigService,
  ) {}

  private async generateUniqueShortCode(): Promise<string> {
    let shortCode: string;
    let shortCodeExists: ShortUrlEntity | null;

    do {
      shortCode = randomBytes(3).toString('hex');
      shortCodeExists =
        await this.shortUrlRepository.findByShortCodeWithoutDeletedAtFilter(
          shortCode,
        );
    } while (shortCodeExists);

    return shortCode;
  }

  async createShortUrl(
    createShortUrlRequestDto: CreateShortUrlRequestDTO,
    userId?: string,
  ) {
    const baseUrl = this.configService.get('BASE_URL_SHORTENER_SERVICE_URL');

    let shortCode = await this.generateUniqueShortCode();

    const shortUrl = await this.shortUrlRepository.create({
      originalUrl: createShortUrlRequestDto.originalUrl,
      shortCode,
      userId,
    });

    return {
      originalUrl: shortUrl.originalUrl,
      shortUrl: `${baseUrl}/${shortCode}`,
    };
  }

  async getOriginalUrl(shortCode: string) {
    const shortUrl = await this.shortUrlRepository.findByShortCode(shortCode);

    if (!shortUrl) {
      throw new ShortUrlNotFoundException();
    }

    await this.shortUrlRepository.incrementOneClick(shortUrl.id);

    return shortUrl.originalUrl;
  }

  async getUserUrls(userId: string) {
    return this.shortUrlRepository.findAllByUserId(userId);
  }

  async updateUrl(
    id: string,
    userId: string,
    updateShortUrlRequestDTO: UpdateShortUrlRequestDTO,
  ) {
    const shortUrl = await this.shortUrlRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!shortUrl) {
      throw new ShortUrlNotFoundException();
    }

    return this.shortUrlRepository.update(id, {
      originalUrl: updateShortUrlRequestDTO.originalUrl,
    });
  }

  async deleteUrl(id: string, userId: string) {
    const shortUrl = await this.shortUrlRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!shortUrl) {
      throw new ShortUrlNotFoundException();
    }

    return this.shortUrlRepository.update(id, { deletedAt: new Date() });
  }
}
