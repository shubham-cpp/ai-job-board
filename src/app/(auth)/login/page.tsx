import type { Metadata } from 'next'
import LoginPage from '../_components/login'

export const metadata: Metadata = {
  title: 'Login | Starter',
}
function SignInPage() {
  return <LoginPage />
}

export default SignInPage
