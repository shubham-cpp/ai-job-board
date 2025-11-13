'use client'

import { DropdownMenuItem } from '@ui/dropdown-menu'
import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

function SignOutButton() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleSignout = async () => {
    setLoading(true)
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login')
          },
        },
      })
    }
    catch (error) {
      toast.error('Error while trying to sign-out')
      console.error('ERROR: while trying to sign-out\n', error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      disabled={loading}
      onClick={handleSignout}
    >
      <LogOutIcon />
      {' '}
      Logout
    </DropdownMenuItem>
  )
}

export default SignOutButton
