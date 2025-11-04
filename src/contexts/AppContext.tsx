import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Service, StoreItem, Order, CartItem } from "@/types";
import { authAPI, servicesAPI, storeItemsAPI, ordersAPI, cartAPI } from "@/services/api";

interface AppContextType {
  // Auth
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string) => Promise<void>;
  logout: () => void;

  // Services
  services: Service[];
  refreshServices: () => Promise<void>;

  // Store Items
  storeItems: StoreItem[];
  refreshStoreItems: () => Promise<void>;

  // Orders
  orders: Order[];
  refreshOrders: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (item: StoreItem, quantity?: number) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const isAdmin = currentUser?.isAdmin || false;

  // Inicializar usuário atual
  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    refreshServices();
    refreshStoreItems();
    refreshOrders();
    loadCart();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = await authAPI.login(email, password);
    if (user) {
      setCurrentUser(user);
      refreshOrders();
      loadCart();
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, phone: string) => {
    const user = await authAPI.register(name, email, phone);
    setCurrentUser(user);
    loadCart();
  };

  const logout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
  };

  const refreshServices = async () => {
    const data = await servicesAPI.getAll();
    setServices(data);
  };

  const refreshStoreItems = async () => {
    const data = await storeItemsAPI.getAll();
    setStoreItems(data);
  };

  const refreshOrders = async () => {
    const data = await ordersAPI.getAll(currentUser ? { userId: currentUser.id } : undefined);
    setOrders(data);
  };

  const loadCart = () => {
    const cartData = cartAPI.get();
    const cartItems: CartItem[] = cartData
      .map((cartItem) => {
        const item = storeItems.find((i) => i.id === cartItem.itemId);
        if (item) {
          return { item, quantity: cartItem.quantity };
        }
        return null;
      })
      .filter((item): item is CartItem => item !== null);
    setCart(cartItems);
  };

  const addToCart = (item: StoreItem, quantity: number = 1) => {
    cartAPI.add(item.id, quantity);
    loadCart();
  };

  const updateCartItem = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    cartAPI.update(itemId, quantity);
    loadCart();
  };

  const removeFromCart = (itemId: string) => {
    cartAPI.remove(itemId);
    loadCart();
  };

  const clearCart = () => {
    cartAPI.clear();
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.item.price * item.quantity, 0);

  // Recarregar carrinho quando storeItems mudar
  useEffect(() => {
    if (storeItems.length > 0) {
      loadCart();
    }
  }, [storeItems]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        register,
        logout,
        services,
        refreshServices,
        storeItems,
        refreshStoreItems,
        orders,
        refreshOrders,
        cart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
