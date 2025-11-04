// Tipos principais do sistema

export type OrderStatus = "Não iniciado" | "Em andamento" | "Aguardando busca" | "Finalizado" | "Cancelado";
export type OrderType = "conserto" | "pedido_especial" | "compra";
export type ItemType = "chaveiro" | "pano" | "enc" | "outro";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  estimated_days: number;
}

export interface StoreItem {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  type: OrderType;
  items?: OrderItem[];
  serviceId?: string;
  photos: string[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes: string;
  description?: string;
  urgency?: "baixa" | "média" | "alta";
  preferredDate?: string;
  estimatedDelivery?: string;
  accepted?: boolean;
  rejectionReason?: string;
  // Campos para pedido especial
  measurements?: string;
  fabric?: string;
  reference?: string;
  acceptsWhatsApp?: boolean;
  totalPrice?: number;
}

export interface CartItem {
  item: StoreItem;
  quantity: number;
}

export interface DashboardStats {
  repairsCompleted: number;
  itemsSold: { [key: string]: number };
  ordersByStatus: { [key in OrderStatus]: number };
  recentOrders: Order[];
  avgCompletionTime: number;
}
