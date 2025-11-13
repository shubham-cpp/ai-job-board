import type { FC, ReactNode } from 'react'
import { requireUser } from '@/lib/server/db/queries/user'

interface ProtectedLayoutProps {
  children: ReactNode
}

const ProtectedLayout: FC<ProtectedLayoutProps> = async ({ children }) => {
  await requireUser()

  return children
}

export default ProtectedLayout
