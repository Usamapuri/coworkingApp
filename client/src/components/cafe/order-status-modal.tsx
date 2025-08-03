import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'preparing' | 'success';
}

export function OrderStatusModal({ isOpen, onClose, status }: OrderStatusModalProps) {
  React.useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Close after 3 seconds on success
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-center py-8">
        {status === 'preparing' ? (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Placing Your Order</h2>
            <p className="text-gray-500">Please wait while we process your order...</p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500">Your order is being prepared. You can track its status in your orders.</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}