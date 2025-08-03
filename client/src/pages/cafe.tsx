// ... (keep existing imports)
import { mapMenuItem } from "@/lib/mappers";

export default function CafePage() {
  // ... (keep existing state and hooks)

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

  // ... (keep rest of the component)
}