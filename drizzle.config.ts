import { defineConfig } from 'drizzle-kit'
import envParse from './src/lib/env'

export default defineConfig({
  out: './src/lib/server/db/migrations',
  schema: './src/lib/server/db/schema.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: envParse.DATABASE_URL,
  },
})
