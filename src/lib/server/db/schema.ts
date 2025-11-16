import type { OrganizationMetaData } from '@/lib/types'
import { relations, sql } from 'drizzle-orm'
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'
import { experienceLevels, jobApplicationStages, jobStatuses, jobTypes, locationRequirements, wageIntervals } from '@/lib/zod-schema'

const id = () => text().primaryKey().$defaultFn(nanoid)

function createdAt() {
  return integer({ mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull()
}

function updatedAt() {
  return integer({ mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
}

export const user = sqliteTable('user', {
  id: id(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: 'boolean' }).default(false).notNull(),
  image: text(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const session = sqliteTable(
  'session',
  {
    id: id(),
    expiresAt: integer({ mode: 'timestamp_ms' }).notNull(),
    token: text().notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
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
  id: id(),
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
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const verification = sqliteTable('verification', {
  id: id(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer({ mode: 'timestamp_ms' }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const organization = sqliteTable(
  'organization',
  {
    id: id(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    logo: text(),
    createdAt: createdAt(),

    metadata: text({ mode: 'json' })
      .$type<OrganizationMetaData>()
      .notNull()
      .default({ minimumRating: undefined, newApplicationsEmailNotifications: false }),
  },
  t => [
    index('organization_name_idx').on(t.name),
    index('organization_created_at_idx').on(t.createdAt),
  ],
)

export const member = sqliteTable(
  'member',
  {
    id: id(),
    organizationId: text()
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: text().default('member').notNull(),
    createdAt: createdAt(),
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
    id: id(),
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

export const jobList = sqliteTable('jobs_list', {
  id: id(),

  title: text().notNull(),
  description: text().notNull(),

  wage: integer(),
  wageInterval: text({ enum: wageIntervals }),

  locationRequirement: text({ enum: locationRequirements }).notNull(),
  experienceLevel: text({ enum: experienceLevels }).notNull(),
  status: text({ enum: jobStatuses }).notNull().default('draft'),
  type: text({ enum: jobTypes }).notNull(),

  stateAbbrevation: text(),
  city: text(),

  isFeatured: integer({ mode: 'boolean' }).notNull().default(false),

  organizationId: text().notNull().references(() => organization.id, { onDelete: 'cascade' }),
  // user who posted/created this job
  ownerId: text().notNull().references(() => user.id, { onDelete: 'cascade' }),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, t => [
  index('jobs_list_state_abbrevation_idx_mine').on(t.stateAbbrevation),
  index('jobs_list_id_and_organization_id_idx').on(t.id, t.organizationId),
  index('jobs_list_id_and_user_id_idx').on(t.id, t.ownerId),
  unique('jobs_list_title_organization_unique_idx').on(t.title, t.organizationId),
])

export const jobApplication = sqliteTable('job_applications', {
  jobListId: text().notNull().references(() => jobList.id, { onDelete: 'cascade' }),
  // user who applied for this job(i.e applicant)
  userId: text().notNull().references(() => user.id, { onDelete: 'cascade' }),

  coverLetter: text(),
  rating: integer(),

  stage: text({ enum: jobApplicationStages }).notNull().default('applied'),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, t => [
  primaryKey({ columns: [t.jobListId, t.userId] }),
])

export const userResume = sqliteTable('user_resumes', {
  userId: text().notNull().references(() => user.id, { onDelete: 'cascade' }),

  resumeFileUrl: text().notNull(),
  resumeFileKey: text().notNull().unique(),
  aiSummary: text(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, t => [
  index('user_resume_user_id_idx').on(t.userId),
])

export const userNotificationSetting = sqliteTable('user_notification_settings', {
  userId: text().notNull().references(() => user.id, { onDelete: 'cascade' }),

  newJobEmailNotification: integer({ mode: 'boolean' }).notNull().default(false),
  aiSummary: text(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, t => [
  index('user_notification_settings_user_id_idx').on(t.userId),
])

export const jobApplicationRelations = relations(jobApplication, ({ one }) => ({
  jobList: one(jobList, {
    fields: [jobApplication.jobListId],
    references: [jobList.id],
  }),
  user: one(user, {
    fields: [jobApplication.userId],
    references: [user.id],
  }),
}))

export const jobListRelations = relations(jobList, ({ one, many }) => ({
  organization: one(organization, {
    fields: [jobList.organizationId],
    references: [organization.id],
  }),
  owner: one(user, {
    fields: [jobList.ownerId],
    references: [user.id],
  }),
  applications: many(jobApplication, { relationName: 'applicants' }),
}))

// Organization plugin relations
export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
  jobList: many(jobList),
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

export const userNotificationSettingRelations = relations(userNotificationSetting, ({ one }) => ({
  user: one(user, {
    fields: [userNotificationSetting.userId],
    references: [user.id],
  }),
}))

export const userResumeRelations = relations(userResume, ({ one }) => ({
  user: one(user, {
    fields: [userResume.userId],
    references: [user.id],
  }),
}))

// Reverse relations on user for organization plugin
export const userRelations = relations(user, ({ many, one }) => ({
  memberships: many(member),
  invitationsSent: many(invitation),
  jobList: many(jobList),
  notifications: one(userNotificationSetting),
  resume: one(userResume),
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
