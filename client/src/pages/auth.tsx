import { SignUpForm } from '../components/auth/SignUpForm';
import { SignInForm } from '../components/auth/SignInForm';
import { SignOutButton } from '../components/auth/SignOutButton';

export default function AuthPage() {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <SignUpForm />
      <hr style={{ margin: '24px 0' }} />
      <SignInForm />
      <hr style={{ margin: '24px 0' }} />
      <SignOutButton />
    </div>
  );
}