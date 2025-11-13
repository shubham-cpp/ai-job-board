import { drizzle } from 'drizzle-orm/libsql'

import { env } from '@/lib/env'
import * as schema from './schema'
import 'server-only'

const db = drizzle(env.DATABASE_URL, { schema, casing: 'snake_case' })

export default db
