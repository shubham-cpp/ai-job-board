import { headers } from 'next/headers'

import { redirect, RedirectType } from 'next/navigation'
import { cache } from 'react'
import { auth } from '../../auth'
import 'server-only'

export const requireUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    redirect('/login', RedirectType.replace)
  }
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  }
})
