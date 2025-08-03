import React from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useUser();
  const [deliveryLocation, setDeliveryLocation] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/cafe/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cart.map(item => ({
            menu_item_id: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price)
          })),
          delivery_location: deliveryLocation,
          notes,
          billed_to: 'personal'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Order placed successfully');
      clearCart();
      setDeliveryLocation('');
      setNotes('');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    },
  });

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handlePlaceOrder = () => {
    if (!deliveryLocation) {
      toast.error('Please enter a delivery location');
      return;
    }
    placeOrderMutation.mutate();
  };

  const cartTotal = getCartTotal();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">Rs. {parseFloat(item.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, (item.quantity || 0) - 1)}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{item.quantity || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, (item.quantity || 0) + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Location</label>
            <Input
              placeholder="e.g., Meeting Room A, 2nd Floor"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Order Notes</label>
            <Textarea
              placeholder="Any special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center font-medium">
            <span>Subtotal</span>
            <span>Rs. {cartTotal.toFixed(2)}</span>
          </div>

          <Button
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={placeOrderMutation.isPending}
          >
            {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      )}
    </div>
  );
}