'use client'

import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import { FormInput } from '@ui/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Logo from '@/components/navbar/logo'
import { authClient } from '@/lib/auth-client'
import { loginSchema } from '@/lib/zod-schema'
import { GoogleSignInButton } from './google-signin-button'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof loginSchema>>({
    disabled: isLoading,
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError(null)
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: true,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => router.push('/protected'),
        onError: (ctx) => {
          setError(ctx.error.message)
          toast.error('Failed to login.', {
            description: ctx.error.message,
          })
          setIsLoading(false)
        },
      },
    )
  }

  const isDisabled
    = form.formState.isValidating
      || form.formState.isSubmitting
      || form.formState.isLoading
      || isLoading

  return (
    <section className={`
      flex bg-zinc-50 px-4 py-16
      md:py-20
      dark:bg-transparent
    `}
    >
      <div className={`
        m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)]
        border bg-card p-0.5 shadow-md
        dark:[--color-muted:var(--color-zinc-900)]
      `}
      >
        <div className="p-8 pb-6">
          <Logo />
          <div>
            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Sign In to Starter
            </h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6">
            <GoogleSignInButton />
          </div>

          <hr className="my-4 border-dashed" />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="john-doe@email.com"
            />
            <FormInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="************"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" type="submit" disabled={isDisabled}>
              {isDisabled ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <input type="text" />
        </div>

        <div className="rounded-(--radius) border bg-muted p-3">
          <p className="text-center text-sm text-accent-foreground">
            Don&apos;t have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  )
}
