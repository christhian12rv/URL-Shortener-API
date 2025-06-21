import { Test, TestingModule } from '@nestjs/testing';
import { RedirectionController } from './redirection.controller';
import { UrlShortenerService } from '../../../url-shortener/infrastructure/services/url-shortener.service';
import { ShortUrlNotFoundException } from '../../../url-shortener/exceptions/url-shortener.exceptions';
import { Response } from 'express';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('RedirectionController', () => {
  let redirectionController: RedirectionController;
  let urlShortenerService: jest.Mocked<UrlShortenerService>;
  let response: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectionController],
      providers: [
        {
          provide: UrlShortenerService,
          useValue: {
            getOriginalUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    redirectionController = module.get<RedirectionController>(
      RedirectionController,
    );
    urlShortenerService = module.get<UrlShortenerService>(
      UrlShortenerService,
    ) as jest.Mocked<UrlShortenerService>;
    response = {
      redirect: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(redirectionController).toBeDefined();
  });

  describe('redirect', () => {
    it('should redirect to the original url if found', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://test.com';

      urlShortenerService.getOriginalUrl.mockResolvedValue(originalUrl);

      await redirectionController.redirect(shortCode, response);

      expect(urlShortenerService.getOriginalUrl).toHaveBeenCalledWith(
        shortCode,
      );
      expect(response.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('should throw if short url not found', async () => {
      const shortCode = 'notfound';

      urlShortenerService.getOriginalUrl.mockRejectedValue(
        new ShortUrlNotFoundException(),
      );

      await expect(
        redirectionController.redirect(shortCode, response),
      ).rejects.toBeInstanceOf(ShortUrlNotFoundException);
    });
  });
});
