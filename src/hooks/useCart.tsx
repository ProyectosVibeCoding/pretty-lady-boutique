import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartItem {
  id: string;
  product_variant_id: string;
  quantity: number;
  variant: {
    id: string;
    size: string;
    color: string;
    color_hex: string | null;
    stock: number;
    price_modifier: number | null;
    product: {
      id: string;
      name: string;
      slug: string;
      base_price: number;
      image_url: string | null;
    };
  };
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemCount: number;
  total: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isAuthenticated: boolean;
  userId: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch cart items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_variant_id,
          quantity,
          product_variants!inner (
            id,
            size,
            color,
            color_hex,
            stock,
            price_modifier,
            products!inner (
              id,
              name,
              slug,
              base_price,
              image_url
            )
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        variant: {
          id: item.product_variants.id,
          size: item.product_variants.size,
          color: item.product_variants.color,
          color_hex: item.product_variants.color_hex,
          stock: item.product_variants.stock,
          price_modifier: item.product_variants.price_modifier,
          product: {
            id: item.product_variants.products.id,
            name: item.product_variants.products.name,
            slug: item.product_variants.products.slug,
            base_price: item.product_variants.products.base_price,
            image_url: item.product_variants.products.image_url,
          },
        },
      })) as CartItem[];
    },
    enabled: !!userId,
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      if (!userId) throw new Error("Debe iniciar sesión para agregar al carrito");

      // Check if item already exists in cart
      const existingItem = items.find(item => item.product_variant_id === variantId);
      
      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id);
        
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: userId,
            product_variant_id: variantId,
            quantity,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", itemId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("id", itemId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      toast.success("Producto eliminado del carrito");
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    await addItemMutation.mutateAsync({ variantId, quantity });
  }, [addItemMutation]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  }, [updateQuantityMutation]);

  const removeItem = useCallback(async (itemId: string) => {
    await removeItemMutation.mutateAsync(itemId);
  }, [removeItemMutation]);

  const clearCart = useCallback(async () => {
    await clearCartMutation.mutateAsync();
  }, [clearCartMutation]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const total = items.reduce((sum, item) => {
    const price = item.variant.product.base_price + (item.variant.price_modifier || 0);
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      isOpen,
      setIsOpen,
      itemCount,
      total,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isAuthenticated: !!userId,
      userId,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
