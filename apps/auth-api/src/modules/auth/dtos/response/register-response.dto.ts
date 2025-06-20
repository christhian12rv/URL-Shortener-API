import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '@repo/shared/modules/user/entities/user.entity';

export class RegisterResponseDTO extends OmitType(UserEntity, ['password']) {}
