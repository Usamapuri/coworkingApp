import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user's profile
  const fetchProfile = async (user_id: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user_id).single();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Update profile
  const updateProfile = async (user_id: string, updates: any) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user_id).select();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  return { loading, error, fetchProfile, updateProfile };
} 