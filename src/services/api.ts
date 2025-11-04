// Mock API usando localStorage para persistência
import { User, Service, StoreItem, Order, DashboardStats, OrderStatus } from "@/types";
import { mockUsers, mockServices, mockStoreItems, mockOrders, ADMIN_CREDENTIALS } from "./mockData";

const STORAGE_KEYS = {
  USERS: "costureira_users",
  SERVICES: "costureira_services",
  STORE_ITEMS: "costureira_store_items",
  ORDERS: "costureira_orders",
  CURRENT_USER: "costureira_current_user",
  CART: "costureira_cart",
};

// Inicializar dados se não existirem
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(mockServices));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STORE_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.STORE_ITEMS, JSON.stringify(mockStoreItems));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
};

initializeStorage();

// Helper para simular delay de rede
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ========== AUTENTICAÇÃO ==========
export const authAPI = {
  login: async (email: string, password: string): Promise<User | null> => {
    await delay();
    // Mock de autenticação simples
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const user = mockUsers.find((u) => u.email === email);
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        return user;
      }
    }
    // Para outros usuários, apenas verifica se existe
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
    const user = users.find((u) => u.email === email);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: async (name: string, email: string, phone: string): Promise<User> => {
    await delay();
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      phone,
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CART);
  },
};

// ========== SERVIÇOS ==========
export const servicesAPI = {
  getAll: async (): Promise<Service[]> => {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || "[]");
  },

  getById: async (id: string): Promise<Service | null> => {
    await delay();
    const services: Service[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || "[]");
    return services.find((s) => s.id === id) || null;
  },

  create: async (service: Omit<Service, "id">): Promise<Service> => {
    await delay();
    const services: Service[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || "[]");
    const newService: Service = {
      ...service,
      id: `s_${Date.now()}`,
    };
    services.push(newService);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    return newService;
  },

  update: async (id: string, updates: Partial<Service>): Promise<Service> => {
    await delay();
    const services: Service[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || "[]");
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Serviço não encontrado");
    services[index] = { ...services[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    return services[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const services: Service[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || "[]");
    const filtered = services.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(filtered));
  },
};

// ========== ITENS DA LOJA ==========
export const storeItemsAPI = {
  getAll: async (): Promise<StoreItem[]> => {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STORE_ITEMS) || "[]");
  },

  getById: async (id: string): Promise<StoreItem | null> => {
    await delay();
    const items: StoreItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORE_ITEMS) || "[]");
    return items.find((i) => i.id === id) || null;
  },

  create: async (item: Omit<StoreItem, "id">): Promise<StoreItem> => {
    await delay();
    const items: StoreItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORE_ITEMS) || "[]");
    const newItem: StoreItem = {
      ...item,
      id: `i_${Date.now()}`,
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.STORE_ITEMS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<StoreItem>): Promise<StoreItem> => {
    await delay();
    const items: StoreItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORE_ITEMS) || "[]");
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item não encontrado");
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.STORE_ITEMS, JSON.stringify(items));
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const items: StoreItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORE_ITEMS) || "[]");
    const filtered = items.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.STORE_ITEMS, JSON.stringify(filtered));
  },
};

// ========== PEDIDOS ==========
export const ordersAPI = {
  getAll: async (filters?: { userId?: string; status?: OrderStatus; type?: string }): Promise<Order[]> => {
    await delay();
    let orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");

    if (filters) {
      if (filters.userId) {
        orders = orders.filter((o) => o.userId === filters.userId);
      }
      if (filters.status) {
        orders = orders.filter((o) => o.status === filters.status);
      }
      if (filters.type) {
        orders = orders.filter((o) => o.type === filters.type);
      }
    }

    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById: async (id: string): Promise<Order | null> => {
    await delay();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    return orders.find((o) => o.id === id) || null;
  },

  create: async (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
    await delay();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    const newOrder: Order = {
      ...order,
      id: `o_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await delay();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Pedido não encontrado");
    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[index];
  },

  update: async (id: string, updates: Partial<Order>): Promise<Order> => {
    await delay();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Pedido não encontrado");
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[index];
  },
};

// ========== DASHBOARD ==========
export const dashboardAPI = {
  getStats: async (period: "day" | "week" | "month" = "month"): Promise<DashboardStats> => {
    await delay();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    const periodOrders = orders.filter((o) => new Date(o.createdAt) >= startDate);

    // Contagem de consertos finalizados
    const repairsCompleted = periodOrders.filter(
      (o) => (o.type === "conserto" || o.type === "pedido_especial") && o.status === "Finalizado"
    ).length;

    // Itens vendidos por tipo
    const itemsSold: { [key: string]: number } = {};
    const items: StoreItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORE_ITEMS) || "[]");
    periodOrders
      .filter((o) => o.type === "compra" && o.items)
      .forEach((o) => {
        o.items?.forEach((orderItem) => {
          const item = items.find((i) => i.id === orderItem.itemId);
          if (item) {
            const type = item.type;
            itemsSold[type] = (itemsSold[type] || 0) + orderItem.quantity;
          }
        });
      });

    // Pedidos por status
    const ordersByStatus: { [key in OrderStatus]: number } = {
      "Não iniciado": 0,
      "Em andamento": 0,
      "Aguardando busca": 0,
      Finalizado: 0,
      Cancelado: 0,
    };
    orders.forEach((o) => {
      ordersByStatus[o.status]++;
    });

    // Pedidos recentes (últimos 5)
    const recentOrders = orders.slice(0, 5);

    // Tempo médio de conclusão (apenas pedidos finalizados)
    const completedOrders = orders.filter((o) => o.status === "Finalizado");
    let avgCompletionTime = 0;
    if (completedOrders.length > 0) {
      const totalTime = completedOrders.reduce((sum, o) => {
        const created = new Date(o.createdAt).getTime();
        const updated = new Date(o.updatedAt).getTime();
        return sum + (updated - created);
      }, 0);
      avgCompletionTime = totalTime / completedOrders.length / (1000 * 60 * 60 * 24); // em dias
    }

    return {
      repairsCompleted,
      itemsSold,
      ordersByStatus,
      recentOrders,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
    };
  },
};

// ========== CARRINHO ==========
export const cartAPI = {
  get: (): { itemId: string; quantity: number }[] => {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : [];
  },

  add: (itemId: string, quantity: number = 1) => {
    const cart = cartAPI.get();
    const existingItem = cart.find((item) => item.itemId === itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ itemId, quantity });
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  update: (itemId: string, quantity: number) => {
    const cart = cartAPI.get();
    const item = cart.find((i) => i.itemId === itemId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }
  },

  remove: (itemId: string) => {
    const cart = cartAPI.get().filter((item) => item.itemId !== itemId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  clear: () => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  },
};
