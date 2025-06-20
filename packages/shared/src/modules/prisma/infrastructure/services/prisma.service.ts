import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.logger.log(
      `Database succesful connected to ${process.env.DATABASE_URL}`,
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();

    this.logger.log(`Database disconnected to ${process.env.DATABASE_URL}`);
  }
}
