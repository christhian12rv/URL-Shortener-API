import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../entities/base.entity';
import { ShortUrlEntity } from '../../short-url/entities/short-url.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity extends BaseEntity {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'johndoe@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'abc@123#',
  })
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Urls encurtadas pelo usuário',
    type: () => [ShortUrlEntity],
  })
  shortUrls?: ShortUrlEntity[];
}
