import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { UrlShortenerService } from './url-shortener.service';
import { ShortUrlRepository } from '@repo/shared/modules/short-url/infrastructure/repositories/short-url.repository';
import { ConfigService } from '@nestjs/config';
import { CreateShortUrlRequestDTO } from '../../dtos/request/create-short-url-request.dto';
import { UpdateShortUrlRequestDTO } from '../../dtos/request/update-short-url-request.dto';
import { ShortUrlEntity } from '@repo/shared/modules/short-url/entities/short-url.entity';
import { ShortUrlNotFoundException } from '../../exceptions/url-shortener.exceptions';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockShortUrlRepository = (): jest.Mocked<
  Partial<ShortUrlRepository>
> => ({
  findByShortCodeWithoutDeletedAtFilter: jest.fn(),
  create: jest.fn(),
  findByShortCode: jest.fn(),
  incrementOneClickByShortCode: jest.fn(),
  findAllByUserId: jest.fn(),
  findByIdAndUserId: jest.fn(),
  update: jest.fn(),
});

const mockConfigService = (): any => ({
  get: jest.fn(),
});

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

describe('UrlShortenerService', () => {
  let urlShortenerService: UrlShortenerService;
  let shortUrlRepository: ReturnType<typeof mockShortUrlRepository>;
  let configService: ReturnType<typeof mockConfigService>;
  let redis: any;

  const userId = '8b5e100f-c6ee-4bc8-8757-589ae1906090';
  const shortCode = 'abc123';
  const baseUrl = 'https://short.com';
  const shortUrlEntity: ShortUrlEntity = {
    id: '1617fb17-fc04-489a-b401-8b2f15d03e51',
    originalUrl: 'https://test.com',
    shortCode,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as ShortUrlEntity;

  beforeEach(async () => {
    redis = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        { provide: ShortUrlRepository, useFactory: mockShortUrlRepository },
        { provide: ConfigService, useFactory: mockConfigService },
        { provide: 'default_IORedisModuleConnectionToken', useValue: redis },
      ],
    }).compile();

    urlShortenerService = module.get<UrlShortenerService>(UrlShortenerService);
    shortUrlRepository = module.get(ShortUrlRepository);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(urlShortenerService).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should create a short url', async () => {
      const createShortUrlRequestDTO: CreateShortUrlRequestDTO = {
        originalUrl: shortUrlEntity.originalUrl,
      };

      configService.get.mockReturnValue(baseUrl);

      const mockCryptoBuffer = {
        toString: jest.fn().mockReturnValue(shortCode),
      } as unknown as Buffer;
      (crypto.randomBytes as jest.Mock).mockReturnValue(mockCryptoBuffer);

      shortUrlRepository.findByShortCodeWithoutDeletedAtFilter.mockResolvedValueOnce(
        null,
      );
      shortUrlRepository.create.mockResolvedValue(shortUrlEntity);

      const result = await urlShortenerService.createShortUrl(
        createShortUrlRequestDTO,
        userId,
      );
      expect(result).toEqual({
        originalUrl: createShortUrlRequestDTO.originalUrl,
        shortUrl: `${baseUrl}/${shortCode}`,
      });
    });
  });

  describe('getOriginalUrl', () => {
    it('should return the original url from cache and increment click', async () => {
      redis.get.mockResolvedValue(shortUrlEntity.originalUrl);
      shortUrlRepository.incrementOneClickByShortCode = jest.fn();

      const result = await urlShortenerService.getOriginalUrl(shortCode);

      expect(result).toBe(shortUrlEntity.originalUrl);
      expect(redis.get).toHaveBeenCalledWith(`shorturl:${shortCode}`);
      expect(
        shortUrlRepository.incrementOneClickByShortCode,
      ).toHaveBeenCalledWith(shortCode);
      expect(redis.set).not.toHaveBeenCalled();
      expect(shortUrlRepository.findByShortCode).not.toHaveBeenCalled();
    });

    it('should return the original url from DB, set cache, and increment click if not cached', async () => {
      redis.get.mockResolvedValue(null);
      shortUrlRepository.findByShortCode.mockResolvedValue(shortUrlEntity);
      shortUrlRepository.incrementOneClickByShortCode = jest.fn();
      redis.set.mockResolvedValue('OK');

      const result = await urlShortenerService.getOriginalUrl(shortCode);

      expect(result).toBe(shortUrlEntity.originalUrl);
      expect(redis.get).toHaveBeenCalledWith(`shorturl:${shortCode}`);
      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        shortCode,
      );
      expect(
        shortUrlRepository.incrementOneClickByShortCode,
      ).toHaveBeenCalledWith(shortCode);
      expect(redis.set).toHaveBeenCalledWith(
        `shorturl:${shortCode}`,
        shortUrlEntity.originalUrl,
        'EX',
        3600,
      );
    });

    it('should throw if short url not found (not cached, not in DB)', async () => {
      redis.get.mockResolvedValue(null);
      shortUrlRepository.findByShortCode.mockResolvedValue(null);

      await expect(
        urlShortenerService.getOriginalUrl(shortCode),
      ).rejects.toBeInstanceOf(ShortUrlNotFoundException);
      expect(redis.get).toHaveBeenCalledWith(`shorturl:${shortCode}`);
      expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
        shortCode,
      );
      expect(redis.set).not.toHaveBeenCalled();
    });
  });

  describe('getUserUrls', () => {
    it('should return all urls for a user', async () => {
      shortUrlRepository.findAllByUserId.mockResolvedValue([shortUrlEntity]);

      const result = await urlShortenerService.getUserUrls(userId);

      expect(result).toEqual([shortUrlEntity]);
    });
  });

  describe('updateUrl', () => {
    const updateShortUrlRequestDTO: UpdateShortUrlRequestDTO = {
      originalUrl: 'https://updated.com',
    };

    it('should update and return the short url', async () => {
      const updatedShortUrl = {
        ...shortUrlEntity,
        originalUrl: 'https://updated.com',
      };

      shortUrlRepository.findByIdAndUserId.mockResolvedValue(shortUrlEntity);
      shortUrlRepository.update.mockResolvedValue(updatedShortUrl);

      const result = await urlShortenerService.updateUrl(
        shortUrlEntity.id,
        userId,
        updateShortUrlRequestDTO,
      );

      expect(result).toEqual(updatedShortUrl);
    });

    it('should throw if short url not found', async () => {
      shortUrlRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        urlShortenerService.updateUrl(
          shortUrlEntity.id,
          userId,
          updateShortUrlRequestDTO,
        ),
      ).rejects.toBeInstanceOf(ShortUrlNotFoundException);
    });
  });

  describe('deleteUrl', () => {
    it('should soft delete the url and return deleted: true', async () => {
      shortUrlRepository.findByIdAndUserId.mockResolvedValue(shortUrlEntity);
      shortUrlRepository.update.mockResolvedValue({
        ...shortUrlEntity,
        deletedAt: new Date(),
      });

      const result = await urlShortenerService.deleteUrl(
        shortUrlEntity.id,
        userId,
      );

      expect(result).toEqual({ deleted: true });
    });

    it('should throw if short url not found', async () => {
      shortUrlRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        urlShortenerService.deleteUrl(shortUrlEntity.id, userId),
      ).rejects.toBeInstanceOf(ShortUrlNotFoundException);
    });
  });
});
