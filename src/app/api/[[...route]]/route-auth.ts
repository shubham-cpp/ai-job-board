import type { MiddlewareHandler } from 'hono'
import type { ApiHono } from './route'
import type { AuthType } from '@/lib/server/auth'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { auth } from '@/lib/server/auth'

const authRoute = new Hono<{ Bindings: AuthType }>({
  strict: false,
}).on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

export function verifyAuth(): MiddlewareHandler<ApiHono> {
  return async (c, next) => {
    const isAuth = !!c.var.user?.id
    if (!isAuth) {
      const res = new Response('Not authenticated.', {
        status: 401,
      })
      throw new HTTPException(401, { res })
    }
    await next()
  }
}

export default authRoute
