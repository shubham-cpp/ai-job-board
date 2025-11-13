'use client'

import type { SignupSchema } from '@/lib/zod-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Logo from '@/components/navbar/logo'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form'
import { authClient } from '@/lib/auth-client'
import { signupSchema } from '@/lib/zod-schema'
import { GoogleSignInButton } from './google-signin-button'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignupSchema>({
    disabled: isLoading,
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const isDisabled
    = form.formState.isValidating
      || form.formState.isSubmitting
      || form.formState.isLoading
      || isLoading

  const onSubmit = async (values: SignupSchema) => {
    setError(null)
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => router.push('/protected'),
        onError: (ctx) => {
          setError(ctx.error.message)
          toast.error('Failed to create account.', {
            description: ctx.error.message,
          })
          setIsLoading(false)
        },
      },
    )
  }

  return (
    <section className={`
      flex bg-zinc-50 p-4
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
              Create a Starter Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6">
            <GoogleSignInButton />
          </div>

          <hr className="my-4 border-dashed" />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 place-items-start gap-3">
              <FormInput
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="John"
              />
              <FormInput
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Doe"
              />
            </div>
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
            <FormInput
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="************"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" type="submit" disabled={isDisabled}>
              {isDisabled ? 'Creating Account...' : 'Continue'}
            </Button>
          </form>
        </div>

        <div className="rounded-(--radius) border bg-muted p-3">
          <p className="text-center text-sm text-accent-foreground">
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Login</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  )
}
