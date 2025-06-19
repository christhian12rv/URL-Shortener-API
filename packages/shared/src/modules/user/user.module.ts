import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/repositories/user.repository';

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
