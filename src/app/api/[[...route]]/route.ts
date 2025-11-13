import type { AuthType } from '@/lib/server/auth'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import { handle } from 'hono/vercel'
import { env } from '@/lib/env'
import { auth } from '@/lib/server/auth'
import authRoute from './route-auth'

export interface ApiHono {
  Variables: AuthType
}

const app = new Hono<ApiHono>({ strict: false })
  .basePath('/api')
  .get('/health', (c) => {
    return c.json({
      message: 'Hello Next.js!',
    })
  })
  .route('/', authRoute)

export type HonoAppType = typeof app

app
  .use(
    '*',
    cors({
      origin: env.BETTER_AUTH_URL,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    }),

    async (c, next) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })

      if (!session) {
        c.set('user', null)
        c.set('session', null)
        return next()
      }

      c.set('user', session.user)
      c.set('session', session.session)
      return next()
    },
  )
  .use(csrf())
  .use(secureHeaders())

// NOTE: doesn't work with bun
if (env.NODE_ENV === 'production') {
  app.use(compress())
}

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
