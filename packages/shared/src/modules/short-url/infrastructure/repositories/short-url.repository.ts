import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/infrastructure/services/prisma.service';
import { CreateShortUrlDTO } from '../../dtos/create-short-url.dto';
import { UpdateShortUrlDTO } from '../../dtos/update-short-url.dto';
import { ShortUrlEntity } from '../../entities/short-url.entity';

@Injectable()
export class ShortUrlRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllByUserId(userId: string): Promise<ShortUrlEntity[] | null> {
    return await this.prismaService.shortUrl.findMany({
      where: { userId, deletedAt: null },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<ShortUrlEntity | null> {
    return await this.prismaService.shortUrl.findUnique({
      where: { id, userId, deletedAt: null },
    });
  }

  async findByShortCode(shortCode: string): Promise<ShortUrlEntity | null> {
    return await this.prismaService.shortUrl.findUnique({
      where: { shortCode, deletedAt: null },
    });
  }

  async findByShortCodeWithoutDeletedAtFilter(
    shortCode: string,
  ): Promise<ShortUrlEntity | null> {
    return await this.prismaService.shortUrl.findUnique({
      where: { shortCode },
    });
  }

  async create(createShortUrlDTO: CreateShortUrlDTO): Promise<ShortUrlEntity> {
    return await this.prismaService.shortUrl.create({
      data: {
        ...createShortUrlDTO,
      },
    });
  }

  async update(
    id: string,
    updateShortUrlDTO: UpdateShortUrlDTO,
  ): Promise<ShortUrlEntity> {
    return await this.prismaService.shortUrl.update({
      where: { id },
      data: {
        ...updateShortUrlDTO,
      },
    });
  }

  async incrementOneClickByShortCode(
    shortCode: string,
  ): Promise<ShortUrlEntity> {
    return await this.prismaService.shortUrl.update({
      where: { shortCode, deletedAt: null },
      data: {
        clicks: { increment: 1 },
      },
    });
  }
}
