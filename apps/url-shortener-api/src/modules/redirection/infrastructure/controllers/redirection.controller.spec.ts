import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { RedirectionController } from './redirection.controller';
import { UrlShortenerService } from '../../../url-shortener/infrastructure/services/url-shortener.service';

describe('RedirectionController', () => {
  let controller: RedirectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectionController],
      providers: [UrlShortenerService],
    }).compile();

    controller = module.get<RedirectionController>(RedirectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
