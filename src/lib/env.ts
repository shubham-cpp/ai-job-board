import { z } from 'zod/v4-mini'

const envSchema = z.object({
  NODE_ENV: z.optional(z.enum(['production', 'development', 'testing'])),
  DATABASE_URL: z.url('Invalid DB Url.'),

  BETTER_AUTH_SECRET: z.string().check(z.minLength(3)),
  BETTER_AUTH_URL: z.url('Invalid better-auth url.'),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

// eslint-disable-next-line node/prefer-global/process
const envParse = envSchema.safeParse(process.env)

if (!envParse.data) {
  throw envParse.error.issues.map(i => ({
    [i.path.join('.')]: { expected: i.message, got: i.input },
  }))
}

export const env = envParse.data

export default envParse.data
