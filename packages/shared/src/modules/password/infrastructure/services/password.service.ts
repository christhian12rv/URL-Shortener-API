import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async compare(plain, hash): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }

  async hash(password: string, salts?: number): Promise<string> {
    return await bcrypt.hash(password, salts ?? 10);
  }
}
