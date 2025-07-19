import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseSpaces() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all spaces
  const fetchSpaces = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('coworking_spaces').select('*');
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Fetch single space by id
  const fetchSpaceById = async (id: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('coworking_spaces').select('*').eq('id', id).single();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Create space (admin only)
  const createSpace = async (space: any) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('coworking_spaces').insert([space]).select();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Update space (admin only)
  const updateSpace = async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('coworking_spaces').update(updates).eq('id', id).select();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Delete space (admin only)
  const deleteSpace = async (id: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('coworking_spaces').delete().eq('id', id);
    setLoading(false);
    if (error) setError(error.message);
    return !error;
  };

  return { loading, error, fetchSpaces, fetchSpaceById, createSpace, updateSpace, deleteSpace };
} 