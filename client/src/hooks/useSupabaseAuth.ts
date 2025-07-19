import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseAuth() {
  const [user, setUser] = useState(supabase.auth.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign Up
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else setUser(data.user);
    return { data, error };
  };

  // Sign In
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else setUser(data.user);
    return { data, error };
  };

  // Sign Out
  const signOut = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) setError(error.message);
    else setUser(null);
    return { error };
  };

  return { user, loading, error, signUp, signIn, signOut };
} 