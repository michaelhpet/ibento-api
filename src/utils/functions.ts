import { SetMetadata } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IS_PUBLIC } from './constants';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export function Public() {
  return SetMetadata(IS_PUBLIC, true);
}
