import type { AuthType } from '@/lib/server/auth'
import { Hono } from 'hono'
import { auth } from '@/lib/server/auth'

const authRoute = new Hono<{ Bindings: AuthType }>({
  strict: false,
}).on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

export default authRoute
