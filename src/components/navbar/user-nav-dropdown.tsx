'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar'
import { Button } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { UserIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import SignOutButton from '@/app/(auth)/_components/sign-out-button'
// import { UserProfileDialog } from "./user-profile-dialog";
// import { useState } from "react";
import { authClient } from '@/lib/auth-client'
import { getPrefix } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
// import { useSessionQuery } from "@/hooks/tan-stack/user-query";

function UserNavDropdown() {
  const path = usePathname()

  const session = authClient.useSession()
  const isLoading = session.isPending || session.isRefetching
  const user = session.data?.user

  // const [dialogOpen, setDialogOpen] = useState(false);

  if (!user || ['/login', '/sign-up'].includes(path))
    return null

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-1">
        <Skeleton className="h-3 w-4 rounded-full" />
        <Skeleton className="h-4 w-8" />
      </div>
    )
  }
  return (
    <>
      {/* <UserProfileDialog open={dialogOpen} onOpenChange={setDialogOpen} /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`
              mt-auto cursor-pointer rounded-xl border-border/60 bg-background
              transition-all duration-200
              hover:rounded-lg hover:bg-accent hover:text-accent-foreground
            `}
            size="icon-lg"
            variant="outline"
          >
            <Avatar className="bg-transparent">
              <AvatarImage
                src={user?.image ?? ''}
                alt={user?.name ?? ''}
                className="object-cover"
              />
              <AvatarFallback className="bg-transparent">
                {getPrefix(user?.name ?? '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="left" sideOffset={8}>
          <DropdownMenuLabel>
            <p className="">{user?.name}</p>
            <p
              className="truncate text-xs text-muted-foreground"
              title={user?.email}
            >
              {user?.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onClick={() => setDialogOpen(true)}> */}
          <DropdownMenuItem>
            <UserIcon />
            {' '}
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserNavDropdown
