import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/infrastructure/services/prisma.service';
import { CreateUserDTO } from '../../dtos/create-user.dto';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    return await this.prismaService.user.create({
      data: {
        ...createUserDTO,
      },
    });
  }
}
