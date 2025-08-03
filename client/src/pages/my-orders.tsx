import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/use-auth';
import { CafeOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function MyOrders() {
  const { user } = useUser();

  const { data: orders = [], isLoading } = useQuery<CafeOrder[]>({
    queryKey: ['/api/cafe/orders'],
    queryFn: async () => {
      const response = await fetch('/api/cafe/orders', {
        credentials: 'include'
      });
      const data = await response.json();
      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order #{order.id}</CardTitle>
                <Badge variant={order.status === 'completed' ? 'success' : 'default'}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.menu_item.name}</span>
                        <span>Rs. {item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>Rs. {order.total_amount}</span>
                  </div>
                </div>
                {order.delivery_location && (
                  <div className="mt-4">
                    <h3 className="font-semibold">Delivery Location:</h3>
                    <p>{order.delivery_location}</p>
                  </div>
                )}
                {order.notes && (
                  <div className="mt-4">
                    <h3 className="font-semibold">Notes:</h3>
                    <p>{order.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}