import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email').notNull().unique(),
  first_name: varchar('first_name').notNull(),
  last_name: varchar('last_name').notNull(),
  password_hash: varchar('password_hash').notNull(),
});
