import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class HashService {
  constructor() {}

  async hashPsw(psw: string): Promise<string> {
    return bcrypt.hash(psw, SALT_ROUNDS);
  }

  async compare(psw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(psw, hash);
  }
}
