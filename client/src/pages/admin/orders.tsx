import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/hooks/use-auth';
import { CafeOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminOrders() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [expandedOrder, setExpandedOrder] = React.useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<CafeOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery<CafeOrder[]>({
    queryKey: ['/api/admin/orders', selectedStatus],
    queryFn: async () => {
      const response = await fetch(`/api/admin/orders${selectedStatus !== 'all' ? `?status=${selectedStatus}` : ''}`, {
        credentials: 'include'
      });
      const data = await response.json();
      return data;
    },
    enabled: !!user && user.role === 'calmkaaj_admin'
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    },
  });

  if (!user || user.role !== 'calmkaaj_admin') {
    return <div>Access denied</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <Select
                    value={order.status}
                    onValueChange={(newStatus) =>
                      updateOrderStatus.mutate({ orderId: order.id, status: newStatus })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Details:</h3>
                  <p>Name: {order.user.first_name} {order.user.last_name}</p>
                  <p>Email: {order.user.email}</p>
                  {order.organization && (
                    <p>Organization: {order.organization.name}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Summary:</h3>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>Rs. {order.total_amount}</span>
                  </div>
                </div>
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

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id} Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {selectedOrder && (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Customer Details:</h3>
                  <p>Name: {selectedOrder.user.first_name} {selectedOrder.user.last_name}</p>
                  <p>Email: {selectedOrder.user.email}</p>
                  {selectedOrder.organization && (
                    <p>Organization: {selectedOrder.organization.name}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Items:</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{item.menu_item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">Rs. {item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>Rs. {selectedOrder.total_amount}</span>
                  </div>
                </div>
                {selectedOrder.delivery_location && (
                  <div>
                    <h3 className="font-semibold">Delivery Location:</h3>
                    <p>{selectedOrder.delivery_location}</p>
                  </div>
                )}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold">Notes:</h3>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">Order Status:</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(newStatus) => {
                        updateOrderStatus.mutate({ orderId: selectedOrder.id, status: newStatus });
                        setSelectedOrder(null);
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}