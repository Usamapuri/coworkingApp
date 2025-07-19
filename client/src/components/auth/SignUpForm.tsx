import { useState } from 'react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export function SignUpForm() {
  const { signUp, loading, error } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signUp(email, password);
    if (!error) setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
      <button type="submit" disabled={loading}>Sign Up</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div>Check your email for a confirmation link!</div>}
    </form>
  );
} 