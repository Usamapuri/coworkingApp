import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Coffee, Check } from "lucide-react";
import { useState } from "react";

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: string;
    image_url?: string;
    is_daily_special?: boolean;
  };
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500); // Reset after 1.5 seconds
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <Coffee className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {item.is_daily_special && (
          <div className="absolute top-2 right-2 bg-warning text-white px-2 py-1 rounded text-xs font-medium">
            Daily Special
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span className="text-lg font-bold text-primary">Rs. {item.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        <Button
          onClick={handleAddToCart}
          className={`w-full ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-blue-700'} text-white transition-colors`}
          disabled={isAdded}
        >
          {isAdded ? (
            <span className="flex items-center justify-center">
              <Check className="w-4 h-4 mr-2" />
              Added to Cart
            </span>
          ) : (
            'Add to Cart'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}