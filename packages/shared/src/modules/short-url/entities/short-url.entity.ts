import { BaseEntity } from '../../../entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class ShortUrlEntity extends BaseEntity {
  originalUrl: string;

  shortCode: string;

  userId?: string;

  user?: UserEntity;
}
