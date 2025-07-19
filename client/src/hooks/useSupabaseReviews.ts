import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseReviews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews for a space
  const fetchReviewsBySpace = async (space_id: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('reviews').select('*').eq('space_id', space_id);
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Fetch reviews by a user
  const fetchReviewsByUser = async (user_id: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('reviews').select('*').eq('user_id', user_id);
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Create review
  const createReview = async (review: any) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('reviews').insert([review]).select();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  return { loading, error, fetchReviewsBySpace, fetchReviewsByUser, createReview };
} 