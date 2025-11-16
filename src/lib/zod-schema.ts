import { z } from 'zod/v4-mini'

export const wageIntervals = ['hourly', 'monthly', 'yearly'] as const
export type WageInterval = (typeof wageIntervals)[number]

export const locationRequirements = ['hybrid', 'in-office', 'remote'] as const
export type LocationRequirement = (typeof locationRequirements)[number]

export const experienceLevels = ['entry', 'junior', 'semi-senior', 'senior', 'lead', 'architect'] as const
export type ExperienceLevel = (typeof experienceLevels)[number]

export const jobStatuses = ['draft', 'delisted', 'published'] as const
export type JobStatus = (typeof jobStatuses)[number]

export const jobTypes = ['internship', 'part-time', 'full-time'] as const
export type JobType = (typeof jobTypes)[number]

export const jobApplicationStages = ['applied', 'denied', 'interested', 'interviewed', 'hired'] as const
export type JobApplicationStage = (typeof jobApplicationStages)[number]

export const loginSchema = z.object({
  email: z.email('Enter a valid email.').check(z.trim()),
  password: z
    .string()
    .check(
      z.minLength(6, 'Password should at least be 6 characters.'),
      z.maxLength(24, 'Maximium 24 characters are allowed.'),
    ),
})

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .check(
        z.trim(),
        z.minLength(3, 'First Name should have minimum of 3 characters.'),
        z.maxLength(18, 'Maximium of 18 characters are allowed.'),
      ),
    lastName: z
      .string()
      .check(
        z.trim(),
        z.minLength(3, 'Last Name should have minimum of 3 characters.'),
        z.maxLength(18, 'Maximium of 18 characters are allowed.'),
      ),
    email: z.email('Enter a valid email.').check(z.trim()),
    password: z
      .string()
      .check(
        z.minLength(6, 'Password should at least be 6 characters.'),
        z.maxLength(24, 'Maximium 24 characters are allowed.'),
      ),
    confirmPassword: z.string(),
  })
  .check(
    z.refine(data => data.password === data.confirmPassword, {
      error: 'Passwords don\'t match.',
      path: ['confirmPassword'],
    }),
    z.refine(data => data.firstName !== data.lastName, {
      error: 'First and Last name cannot be the same.',
      path: ['lastName'],
    }),
  )
export type SignupSchema = z.infer<typeof signupSchema>
