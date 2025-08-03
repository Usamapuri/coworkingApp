import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPakistanTime } from '@/lib/pakistan-time';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface RoomCardCalendarProps {
  room: any;
  selectedDate: string;
  onTimeSlotSelect: (room: any, time: string) => void;
  selectedTimeSlot?: string;
  isNightShift?: boolean;
}

export function RoomCardCalendar({ 
  room, 
  selectedDate, 
  onTimeSlotSelect, 
  selectedTimeSlot,
  isNightShift = false
}: RoomCardCalendarProps) {
  // Fetch room bookings for the selected date
  const { data: bookings = [], error: bookingsError, isLoading } = useQuery({
    queryKey: ['room-bookings', room.id, selectedDate],
    queryFn: async () => {
      console.log('Fetching bookings for room:', room.id, 'date:', selectedDate);
      const response = await fetch(`/api/rooms/${room.id}/bookings?date=${selectedDate}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch room bookings');
      }
      const data = await response.json();
      console.log('Bookings data:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchInterval: false, // Disable auto-polling to reduce compute costs
  });

  // Generate time slots using useMemo to avoid infinite loops
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const now = getPakistanTime();
    
    if (isNightShift) {
      // Night shift: 8 PM to 7 AM
      // First part: 8 PM to 11 PM
      for (let hour = 20; hour <= 23; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const slotStart = new Date(`${selectedDate}T${timeString}`);
        const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
        
        const hasConflict = Array.isArray(bookings) && bookings.some((booking: any) => {
          const bookingStart = new Date(booking.start_time);
          const bookingEnd = new Date(booking.end_time);
          return (
            booking.status === 'confirmed' &&
            slotStart < bookingEnd &&
            slotEnd > bookingStart
          );
        });
        
        const isPast = slotStart < now;
        
        slots.push({
          time: timeString,
          available: !hasConflict && !isPast
        });
      }
      
      // Second part: 12 AM to 7 AM (next day)
      for (let hour = 0; hour <= 7; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDateString = nextDay.toISOString().split('T')[0];
        const slotStart = new Date(`${nextDateString}T${timeString}`);
        const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
        
        const hasConflict = Array.isArray(bookings) && bookings.some((booking: any) => {
          const bookingStart = new Date(booking.start_time);
          const bookingEnd = new Date(booking.end_time);
          return (
            booking.status === 'confirmed' &&
            slotStart < bookingEnd &&
            slotEnd > bookingStart
          );
        });
        
        const isPast = slotStart < now;
        
        slots.push({
          time: timeString,
          available: !hasConflict && !isPast
        });
      }
    } else {
      // Day shift: 8 AM to 7 PM
      for (let hour = 8; hour <= 19; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const slotStart = new Date(`${selectedDate}T${timeString}`);
        const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
        
        const hasConflict = Array.isArray(bookings) && bookings.some((booking: any) => {
          const bookingStart = new Date(booking.start_time);
          const bookingEnd = new Date(booking.end_time);
          return (
            booking.status === 'confirmed' &&
            slotStart < bookingEnd &&
            slotEnd > bookingStart
          );
        });
        
        const isPast = slotStart < now;
        
        slots.push({
          time: timeString,
          available: !hasConflict && !isPast
        });
      }
    }
    
    return slots;
  }, [bookings, selectedDate, isNightShift]);

  const formatTime = (time: string) => {
    const [hour] = time.split(':');
    const hourNum = parseInt(hour);
    
    if (hourNum === 0) return '12:00 AM';
    if (hourNum < 12) return `${hourNum}:00 AM`;
    if (hourNum === 12) return '12:00 PM';
    return `${hourNum - 12}:00 PM`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Loading available times...</h4>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-8 bg-gray-100 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className="text-red-500 text-sm">
        Error loading available times. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Available Times - {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}</h4>
      </div>

      {/* Time Slots Grid - 4 columns, 3 rows */}
      <div className="grid grid-cols-4 gap-1">
        {timeSlots.map((slot) => (
          <Button
            key={slot.time}
            variant="outline"
            size="sm"
            disabled={!slot.available}
            onClick={() => slot.available && onTimeSlotSelect(room, slot.time)}
            className={`
              h-8 text-xs px-2 py-1
              ${slot.available 
                ? 'border-green-300 bg-green-50 hover:bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              }
              ${selectedTimeSlot === slot.time ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
            `}
          >
            {formatTime(slot.time)}
          </Button>
        ))}
      </div>
    </div>
  );
}