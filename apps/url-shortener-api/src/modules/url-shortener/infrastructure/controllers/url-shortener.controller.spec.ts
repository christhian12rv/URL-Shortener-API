import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from '../services/url-shortener.service';
import { CreateShortUrlRequestDTO } from '../../dtos/request/create-short-url-request.dto';
import { UpdateShortUrlRequestDTO } from '../../dtos/request/update-short-url-request.dto';
import { ShortUrlWithRedirectionUrlResponseDTO } from '../../dtos/response/short-url-with-redirection-url-response.dto';
import { ShortUrlEntity } from '@repo/shared/modules/short-url/entities/short-url.entity';
import { DeleteUrlResponseDTO } from '../../dtos/response/delete-url-response.dto';
import { ShortUrlNotFoundException } from '../../exceptions/url-shortener.exceptions';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('UrlShortenerController', () => {
  let urlShortenerController: UrlShortenerController;
  let urlShortenerService: jest.Mocked<UrlShortenerService>;

  const userId = '8b5e100f-c6ee-4bc8-8757-589ae1906090';
  const shortUrlEntity: ShortUrlEntity = {
    id: '1617fb17-fc04-489a-b401-8b2f15d03e51',
    originalUrl: 'https://test.com',
    shortCode: 'abc123',
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const shortUrl = `https://short.com/${shortUrlEntity.shortCode}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [
        {
          provide: UrlShortenerService,
          useValue: {
            createShortUrl: jest.fn(),
            getUserUrls: jest.fn(),
            updateUrl: jest.fn(),
            deleteUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    urlShortenerController = module.get<UrlShortenerController>(
      UrlShortenerController,
    );
    urlShortenerService = module.get<UrlShortenerService>(
      UrlShortenerService,
    ) as jest.Mocked<UrlShortenerService>;
  });

  it('should be defined', () => {
    expect(urlShortenerController).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should create a short url', async () => {
      const createShortUrlRequestDTO: CreateShortUrlRequestDTO = {
        originalUrl: shortUrlEntity.originalUrl,
      };

      const result: ShortUrlWithRedirectionUrlResponseDTO = {
        originalUrl: createShortUrlRequestDTO.originalUrl,
        shortUrl,
      };

      urlShortenerService.createShortUrl.mockResolvedValue(result);

      await expect(
        urlShortenerController.createShortUrl(createShortUrlRequestDTO, {
          sub: userId,
        } as any),
      ).resolves.toEqual(result);
      expect(urlShortenerService.createShortUrl).toHaveBeenCalledWith(
        createShortUrlRequestDTO,
        userId,
      );
    });
  });

  describe('getUserUrls', () => {
    it('should return user urls', async () => {
      const shortUrls: ShortUrlEntity[] = [shortUrlEntity];

      urlShortenerService.getUserUrls.mockResolvedValue(shortUrls);

      await expect(
        urlShortenerController.getUserUrls({ user: { userId } } as any),
      ).resolves.toEqual(shortUrls);
      expect(urlShortenerService.getUserUrls).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateUrl', () => {
    const updateShortUrlRequestDTO: UpdateShortUrlRequestDTO = {
      originalUrl: 'https://othertest.com',
    };

    it('should update a url', async () => {
      const updatedShortUrl: ShortUrlEntity = {
        ...shortUrlEntity,
        originalUrl: updateShortUrlRequestDTO.originalUrl,
      } as ShortUrlEntity;

      urlShortenerService.updateUrl.mockResolvedValue(updatedShortUrl);

      await expect(
        urlShortenerController.updateUrl(
          shortUrlEntity.id,
          { user: { userId } } as any,
          updateShortUrlRequestDTO,
        ),
      ).resolves.toEqual(updatedShortUrl);
      expect(urlShortenerService.updateUrl).toHaveBeenCalledWith(
        shortUrlEntity.id,
        userId,
        updateShortUrlRequestDTO,
      );
    });

    it('should throw if url not found', async () => {
      urlShortenerService.updateUrl.mockRejectedValue(
        new ShortUrlNotFoundException(),
      );

      await expect(
        urlShortenerController.updateUrl(
          '1617fb17-fc04-489a-b401-8b2f15d03e51',
          { user: { userId } } as any,
          { originalUrl: updateShortUrlRequestDTO.originalUrl } as any,
        ),
      ).rejects.toBeInstanceOf(ShortUrlNotFoundException);
    });
  });

  describe('deleteUrl', () => {
    it('should delete a url', async () => {
      const result: DeleteUrlResponseDTO = { deleted: true };

      urlShortenerService.deleteUrl.mockResolvedValue(result);

      await expect(
        urlShortenerController.deleteUrl(shortUrlEntity.id, {
          user: { userId },
        } as any),
      ).resolves.toEqual(result);
      expect(urlShortenerService.deleteUrl).toHaveBeenCalledWith(
        shortUrlEntity.id,
        userId,
      );
    });

    it('should throw if url not found', async () => {
      urlShortenerService.deleteUrl.mockRejectedValue(
        new ShortUrlNotFoundException(),
      );

      await expect(
        urlShortenerController.deleteUrl(
          '1617fb17-fc04-489a-b401-8b2f15d03e51',
          {
            user: { userId },
          } as any,
        ),
      ).rejects.toBeInstanceOf(ShortUrlNotFoundException);
    });
  });
});
