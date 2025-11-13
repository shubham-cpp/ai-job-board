import type { Metadata } from 'next'
import SignupPage from '../_components/sign-up'

export const metadata: Metadata = {
  title: 'Sign Up | Starter',
}
function SignUpPageComponent() {
  return <SignupPage />
}

export default SignUpPageComponent
