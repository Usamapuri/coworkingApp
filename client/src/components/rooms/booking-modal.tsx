import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MeetingRoom } from '@/lib/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: MeetingRoom;
  selectedDate: string;
  selectedTime: string;
  onSuccess: () => void;
}

export function BookingModal({ isOpen, onClose, room, selectedDate, selectedTime, onSuccess }: BookingModalProps) {
  const { user } = useUser();
  const [notes, setNotes] = React.useState('');

  const bookingMutation = useMutation({
    mutationFn: async () => {
      // Convert selected date and time to start_time and end_time
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          room_id: room.id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          notes,
          billed_to: 'personal'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Room booked successfully');
      setNotes('');
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to book room');
    },
  });

  const handleBookRoom = () => {
    bookingMutation.mutate();
  };

  const availableCredits = (user?.credits || 0) - (user?.used_credits || 0);
  const creditsNeeded = room.credit_cost_per_hour || Math.ceil(room.hourly_rate / 100);
  const canBook = availableCredits >= creditsNeeded;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {room.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Booking Details</h3>
            <p className="text-sm text-gray-500">
              Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-500">
              Time: {selectedTime}
            </p>
            <p className="text-sm text-gray-500">
              Duration: 1 hour
            </p>
            <p className="text-sm text-gray-500">
              Credits Required: {creditsNeeded}
            </p>
            <p className="text-sm text-gray-500">
              Your Available Credits: {availableCredits}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Notes (optional)</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Any special requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {!canBook && (
            <div className="text-red-500 text-sm">
              You don't have enough credits to book this room.
              You need {creditsNeeded} credits but only have {availableCredits} available.
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleBookRoom}
              disabled={!canBook || bookingMutation.isPending}
            >
              {bookingMutation.isPending ? 'Booking...' : 'Book Room'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}