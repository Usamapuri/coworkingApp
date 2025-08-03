import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";
import { MenuItemType, CafeOrder } from "@/lib/types";
import { mapMenuItem, mapOrder } from "@/lib/mappers";
import { Search, Filter, Coffee, Utensils, Building, CreditCard, AlertCircle } from "lucide-react";

export default function CafePage() {
  const { user } = useAuth();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [billingType, setBillingType] = useState<"personal" | "organization">("personal");
  const [orderNotes, setOrderNotes] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [currentOrder, setCurrentOrder] = useState<CafeOrder | null>(null);

  const { data: categories = [], error: categoriesError } = useQuery({
    queryKey: ["/api/menu/categories"],
    enabled: !!user,
    onError: (error) => {
      console.error('❌ Error fetching menu categories:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Successfully fetched menu categories:', data);
    }
  });

  const { data: menuItems = [], error: menuError } = useQuery<MenuItemType[]>({
    queryKey: ["/api/menu/items"],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0], {
        credentials: "include"
      });
      const data = await response.json();
      return data.map(mapMenuItem);
    },
    enabled: !!user,
    onError: (error) => {
      console.error('❌ Error fetching menu items:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Successfully fetched menu items:', data);
    }
  });

  const { data: myOrders = [], error: ordersError } = useQuery<CafeOrder[]>({
    queryKey: ["/api/cafe/orders"],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0], {
        credentials: "include"
      });
      const data = await response.json();
      return data.map(mapOrder);
    },
    enabled: !!user,
    onError: (error) => {
      console.error('❌ Error fetching orders:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Successfully fetched orders:', data);
    }
  });

  // WebSocket for real-time order updates
  useWebSocket({
    onMessage: (message) => {
      if (message.type === 'ORDER_UPDATE' && message.userId === user?.id) {
        queryClient.invalidateQueries({ queryKey: ["/api/cafe/orders"] });
        toast({
          title: "Order Update",
          description: `Your order #${message.orderId} status has been updated to ${message.status}`,
        });
      }
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest('POST', '/api/cafe/orders', orderData);
    },
    onSuccess: () => {
      setIsCheckingOut(false);
      clearCart();
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cafe/orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      billed_to: billingType,
      org_id: billingType === "organization" ? user?.organization_id : null,
      notes: orderNotes || null,
      delivery_location: deliveryLocation || null,
      site: user?.site,
    };

    createOrderMutation.mutate(orderData);
  };

  // Filter and sort menu items
  const filteredItems = menuItems
    .filter((item) => {
      if (!item.is_available) return false;
      if (selectedCategory !== "all" && item.category_id !== parseInt(selectedCategory)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price": return parseFloat(a.price) - parseFloat(b.price);
        case "popularity": return (b.order_count || 0) - (a.order_count || 0);
        default: return a.name.localeCompare(b.name);
      }
    });

  const canChargeToOrg = user?.can_charge_cafe_to_org && user?.organization_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Café Menu</h2>
        <p className="text-gray-600">Order your favorite food and drinks</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Items
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id.toString())}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Sort By</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={sortBy === "name" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("name")}
                >
                  Name
                </Button>
                <Button
                  variant={sortBy === "price" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("price")}
                >
                  Price
                </Button>
                <Button
                  variant={sortBy === "popularity" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("popularity")}
                >
                  Popularity
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  Rs. {item.price}
                </Badge>
              </div>
              
              {item.is_available ? (
                <Button
                  className="w-full mt-4"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </Button>
              ) : (
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  disabled
                >
                  Out of Stock
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
          </DialogHeader>
          
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-4">
                {canChargeToOrg && (
                  <div className="space-y-3">
                    <Label>Billing Options</Label>
                    <RadioGroup
                      value={billingType}
                      onValueChange={(value) => setBillingType(value as "personal" | "organization")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Pay Myself
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="organization" id="organization" />
                        <Label htmlFor="organization" className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Charge to Company
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div>
                  <Label>Delivery Location</Label>
                  <Input
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="e.g., Meeting Room A, 2nd Floor"
                  />
                </div>

                <div>
                  <Label>Order Notes</Label>
                  <Textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>
                    Rs. {cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Coffee className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Add some delicious items to get started!</p>
              <Button variant="outline" onClick={() => setShowCart(false)}>
                Browse Menu
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Button */}
      <Button
        className="fixed bottom-6 right-6 shadow-lg"
        onClick={() => setShowCart(true)}
      >
        <Utensils className="h-5 w-5 mr-2" />
        Cart ({cart.length})
      </Button>
    </div>
  );
}