import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseBookings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings for a user
  const fetchBookingsByUser = async (user_id: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('bookings').select('*').eq('user_id', user_id);
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Fetch bookings for a space
  const fetchBookingsBySpace = async (space_id: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('bookings').select('*').eq('space_id', space_id);
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Create booking
  const createBooking = async (booking: any) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('bookings').insert([booking]).select();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Update booking status
  const updateBookingStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select();
    setLoading(false);
    if (error) setError(error.message);
    return data;
  };

  // Delete booking
  const deleteBooking = async (id: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    setLoading(false);
    if (error) setError(error.message);
    return !error;
  };

  return { loading, error, fetchBookingsByUser, fetchBookingsBySpace, createBooking, updateBookingStatus, deleteBooking };
} 