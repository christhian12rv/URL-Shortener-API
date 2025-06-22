import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { ShortUrlNotFoundException } from '../../exceptions/url-shortener.exceptions';
import { ShortUrlRepository } from '@repo/shared/modules/short-url/infrastructure/repositories/short-url.repository';
import { CreateShortUrlRequestDTO } from '../../dtos/request/create-short-url-request.dto';
import { UpdateShortUrlRequestDTO } from '../../dtos/request/update-short-url-request.dto';
import { ShortUrlEntity } from '@repo/shared/modules/short-url/entities/short-url.entity';
import { ShortUrlWithRedirectionUrlResponseDTO } from '../../dtos/response/short-url-with-redirection-url-response.dto';
import { DeleteUrlResponseDTO } from '../../dtos/response/delete-url-response.dto';

@Injectable()
export class UrlShortenerService {
  private readonly logger = new Logger(UrlShortenerService.name);

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
  ): Promise<ShortUrlWithRedirectionUrlResponseDTO> {
    this.logger.log('Starting createShortUrl');

    const baseUrl = this.configService.get('URL_SHORTENER_API_BASE_URL');

    const shortCode = await this.generateUniqueShortCode();

    const shortUrl = await this.shortUrlRepository.create({
      originalUrl: createShortUrlRequestDto.originalUrl,
      shortCode,
      userId,
    });

    this.logger.log('Completed createShortUrl');

    return {
      originalUrl: shortUrl.originalUrl,
      shortUrl: `${baseUrl}/${shortCode}`,
    };
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    this.logger.log('Starting getOriginalUrl');

    const shortUrl = await this.shortUrlRepository.findByShortCode(shortCode);

    if (!shortUrl) {
      this.logger.log('Failed getOriginalUrl - ShortUrl not found');
      throw new ShortUrlNotFoundException();
    }

    await this.shortUrlRepository.incrementOneClick(shortUrl.id);

    this.logger.log('Starting getOriginalUrl');

    return shortUrl.originalUrl;
  }

  async getUserUrls(userId: string): Promise<ShortUrlEntity[]> {
    this.logger.log('Starting getUserUrls');

    const userUrls = await this.shortUrlRepository.findAllByUserId(userId);

    this.logger.log('Completed getUserUrls');

    return userUrls;
  }

  async updateUrl(
    id: string,
    userId: string,
    updateShortUrlRequestDTO: UpdateShortUrlRequestDTO,
  ): Promise<ShortUrlEntity> {
    this.logger.log('Starting updateUrl');

    const shortUrl = await this.shortUrlRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!shortUrl) {
      this.logger.log('Failed updateUrl - ShortUrl not found');
      throw new ShortUrlNotFoundException();
    }

    const updatedShortUrl = await this.shortUrlRepository.update(id, {
      originalUrl: updateShortUrlRequestDTO.originalUrl,
    });

    this.logger.log('Completed updateUrl');

    return updatedShortUrl;
  }

  async deleteUrl(id: string, userId: string): Promise<DeleteUrlResponseDTO> {
    this.logger.log('Completed deleteUrl');

    const shortUrl = await this.shortUrlRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!shortUrl) {
      this.logger.log('Failed deleteUrl - ShortUrl not found');
      throw new ShortUrlNotFoundException();
    }

    await this.shortUrlRepository.update(id, { deletedAt: new Date() });

    this.logger.log('Completed deleteUrl');

    return {
      deleted: true,
    };
  }
}
