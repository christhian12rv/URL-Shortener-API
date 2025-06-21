import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class ShortUrlEntity extends BaseEntity {
  @ApiProperty({
    description: 'Url original',
    example: 'https://www.google.com',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'Código da Url encurtada',
    example: '123ABC',
  })
  shortCode: string;

  @ApiProperty({
    description: 'Id do usuário',
    example: '38666be4-43fb-46d0-82df-c75673c13114',
  })
  userId?: string;

  @ApiProperty({
    description: 'Usuário responsável pela Url encurtada',
    type: () => UserEntity,
  })
  user?: UserEntity;
}
