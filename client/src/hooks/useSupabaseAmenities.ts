import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseAmenities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all amenities
  const fetchAmenities = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('amenities').select('*');
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Fetch amenities for a space
  const fetchAmenitiesBySpace = async (space_id: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('space_amenities')
      .select('amenity_id, amenities (name, description, icon)')
      .eq('space_id', space_id);
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Create amenity (admin only)
  const createAmenity = async (amenity: any) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('amenities').insert([amenity]).select();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Link amenity to space (admin only)
  const linkAmenityToSpace = async (space_id: string, amenity_id: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('space_amenities').insert([{ space_id, amenity_id }]).select();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Unlink amenity from space (admin only)
  const unlinkAmenityFromSpace = async (space_id: string, amenity_id: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('space_amenities').delete().eq('space_id', space_id).eq('amenity_id', amenity_id);
    setLoading(false);
    if (error) setError(error.message);
    return !error;
  };

  return { loading, error, fetchAmenities, fetchAmenitiesBySpace, createAmenity, linkAmenityToSpace, unlinkAmenityFromSpace };
} 