import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../entities/base.entity';

export class UserEntity extends BaseEntity {
  email: string;

  @Exclude()
  password: string;
}
