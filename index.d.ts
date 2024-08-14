import { users } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';

declare global {
  namespace Express {
    export interface Request {
      user: InferSelectModel<typeof users>;
    }
  }
}
