import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../entities/base.entity';
import { ShortUrlEntity } from '../../short-url/entities/short-url.entity';

export class UserEntity extends BaseEntity {
  email: string;

  @Exclude()
  password: string;

  shortUrls?: ShortUrlEntity[];
}
