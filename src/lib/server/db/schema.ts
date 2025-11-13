import { relations, sql } from 'drizzle-orm'
import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

export const user = sqliteTable('user', {
  id: text().primaryKey().$defaultFn(nanoid),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: 'boolean' }).default(false).notNull(),
  image: text(),
  createdAt: integer({ mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = sqliteTable(
  'session',
  {
    id: text().primaryKey().$defaultFn(nanoid),
    expiresAt: integer({ mode: 'timestamp_ms' }).notNull(),
    token: text().notNull().unique(),
    createdAt: integer({ mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer({ mode: 'timestamp_ms' })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    activeOrganizationId: text(),
  },
  t => [
    index('session_user_id_idx').on(t.userId),
    index('session_active_organization_id_idx').on(t.activeOrganizationId),
  ],
)

export const account = sqliteTable('account', {
  id: text().primaryKey().$defaultFn(nanoid),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: integer({
    mode: 'timestamp_ms',
  }),
  refreshTokenExpiresAt: integer({
    mode: 'timestamp_ms',
  }),
  scope: text(),
  password: text(),
  createdAt: integer({ mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const verification = sqliteTable('verification', {
  id: text().primaryKey().$defaultFn(nanoid),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer({ mode: 'timestamp_ms' }).notNull(),
  createdAt: integer({ mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const organization = sqliteTable(
  'organization',
  {
    id: text().primaryKey().$defaultFn(nanoid),
    name: text().notNull(),
    slug: text().notNull().unique(),
    logo: text(),
    createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
    metadata: text(),
  },
  t => [
    index('organization_name_idx').on(t.name),
    index('organization_created_at_idx').on(t.createdAt),
  ],
)

export const member = sqliteTable(
  'member',
  {
    id: text().primaryKey().$defaultFn(nanoid),
    organizationId: text()
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: text().default('member').notNull(),
    createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  },
  t => [
    index('member_organization_id_idx').on(t.organizationId),
    index('member_user_id_idx').on(t.userId),
    index('member_role_idx').on(t.role),
    unique('member_org_user_unique').on(t.organizationId, t.userId),
  ],
)

export const invitation = sqliteTable(
  'invitation',
  {
    id: text().primaryKey().$defaultFn(nanoid),
    organizationId: text()
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    email: text().notNull(),
    role: text(),
    status: text().default('pending').notNull(),
    expiresAt: integer({ mode: 'timestamp_ms' }).notNull(),
    inviterId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  t => [
    // Common queries: list invitations by org and status, lookup by email
    index('invitation_email_idx').on(t.email),
    index('invitation_org_id_status_idx').on(t.organizationId, t.status),
    index('invitation_expires_at_idx').on(t.expiresAt),
    unique('invitation_org_email_status_unique').on(
      t.organizationId,
      t.email,
      t.status,
    ),
  ],
)

// Organization plugin relations
export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}))

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}))

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}))

// Reverse relations on user for organization plugin
export const userRelations = relations(user, ({ many }) => ({
  memberships: many(member),
  invitationsSent: many(invitation),
}))

// Session relations for active organization linkage
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
  activeOrganization: one(organization, {
    fields: [session.activeOrganizationId],
    references: [organization.id],
  }),
}))
