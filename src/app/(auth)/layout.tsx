import type { FC, ReactNode } from 'react'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { auth } from '@/lib/server/auth'

interface LoginSigninLayoutProps {
  children: ReactNode
}

const LoginSigninLayout: FC<LoginSigninLayoutProps> = async ({ children }) => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user?.id) {
    redirect('/protected', RedirectType.replace)
  }

  return children
}

export default LoginSigninLayout
