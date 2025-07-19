import { useState } from 'react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export function SignInForm() {
  const { signIn, loading, error } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>Sign In</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
} 