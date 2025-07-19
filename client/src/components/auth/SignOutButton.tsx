import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export function SignOutButton() {
  const { signOut, loading } = useSupabaseAuth();

  return (
    <button onClick={signOut} disabled={loading}>
      Sign Out
    </button>
  );
} 