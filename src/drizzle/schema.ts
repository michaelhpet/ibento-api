import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email').notNull().unique(),
    first_name: varchar('first_name').notNull(),
    last_name: varchar('last_name').notNull(),
    display_name: varchar('display_name'),
    avatar_url: varchar('avatar_url'),
    password_hash: varchar('password_hash'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    emailIndex: index('email_index').on(table.email),
  }),
);

export const eventVisibility = pgEnum('event_visibility', [
  'public',
  'private',
]);

export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').references(() => users.id),
    name: varchar('name').notNull(),
    description: varchar('description').notNull(),
    image_url: varchar('image_url'),
    dates: timestamp('dates').array().notNull(),
    visibility: eventVisibility('visibility').default('private'),
    published: boolean('published').default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    nameIndex: index('name_index').on(table.name),
    visibilityIndex: index('visibility_index').on(table.visibility),
    publishedIndex: index('published_index').on(table.published),
  }),
);

export const events_guests = pgTable(
  'events_guests',
  {
    event_id: uuid('event_id')
      .notNull()
      .references(() => events.id),
    user_id: uuid('guest_id')
      .notNull()
      .references(() => users.id),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    primaryKay: primaryKey({ columns: [table.event_id, table.user_id] }),
  }),
);
