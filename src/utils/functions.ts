import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export function generateJWT(data: Record<string, unknown>) {
  return jsonwebtoken.sign(data, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
}
