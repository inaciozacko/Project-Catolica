// Dados mock iniciais para popular o localStorage
import { User, Service, StoreItem, Order } from "@/types";

export const mockUsers: User[] = [
  {
    id: "u_001",
    name: "Maria Silva",
    email: "maria@example.com",
    phone: "+55 11 91234-5678",
  },
  {
    id: "u_002",
    name: "João Santos",
    email: "joao@example.com",
    phone: "+55 11 98765-4321",
  },
  {
    id: "admin",
    name: "Administrador",
    email: "admin@costureira.com",
    phone: "+55 11 99999-9999",
    isAdmin: true,
  },
];

export const mockServices: Service[] = [
  {
    id: "s_001",
    title: "Conserto de Barra",
    description: "Ajuste de barra em calças, saias ou vestidos",
    price: 25.0,
    estimated_days: 2,
  },
  {
    id: "s_002",
    title: "Ajuste de Costura",
    description: "Ajustes gerais de costura em peças de roupa",
    price: 35.0,
    estimated_days: 3,
  },
  {
    id: "s_003",
    title: "Customização",
    description: "Customização de peças com bordados ou aplicações",
    price: 50.0,
    estimated_days: 5,
  },
  {
    id: "s_004",
    title: "Troca de Zíper",
    description: "Substituição de zíper em calças, jaquetas ou bolsas",
    price: 30.0,
    estimated_days: 2,
  },
];

export const mockStoreItems: StoreItem[] = [
  {
    id: "i_001",
    name: "Chaveiro Bordado",
    type: "chaveiro",
    description: "Chaveiro artesanal com bordado personalizado",
    price: 10.0,
    stock: 20,
  },
  {
    id: "i_002",
    name: "Pano de Prato Floral",
    type: "pano",
    description: "Pano de prato 100% algodão com estampa floral",
    price: 15.0,
    stock: 15,
  },
  {
    id: "i_003",
    name: "Necessaire Pequena",
    type: "enc",
    description: "Necessaire compacta para uso diário",
    price: 25.0,
    stock: 10,
  },
  {
    id: "i_004",
    name: "Pano de Prato Listrado",
    type: "pano",
    description: "Pano de prato com listras coloridas",
    price: 15.0,
    stock: 12,
  },
  {
    id: "i_005",
    name: "Chaveiro de Feltro",
    type: "chaveiro",
    description: "Chaveiro feito em feltro com formato de coração",
    price: 8.0,
    stock: 25,
  },
];

export const mockOrders: Order[] = [
  {
    id: "o_001",
    userId: "u_001",
    type: "conserto",
    serviceId: "s_001",
    photos: [],
    status: "Em andamento",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    notes: "Barra 3cm mais curta",
    description: "Calça jeans precisa ajustar a barra",
    urgency: "média",
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "o_002",
    userId: "u_002",
    type: "compra",
    items: [
      { itemId: "i_001", quantity: 2 },
      { itemId: "i_002", quantity: 1 },
    ],
    photos: [],
    status: "Finalizado",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Presente para a mãe",
    totalPrice: 35.0,
  },
  {
    id: "o_003",
    userId: "u_001",
    type: "pedido_especial",
    photos: [],
    status: "Não iniciado",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    notes: "Vestido para festa de casamento",
    description: "Vestido longo na cor azul marinho",
    measurements: "Busto: 90cm, Cintura: 70cm, Quadril: 95cm, Altura: 165cm",
    fabric: "Crepe",
    reference: "Modelo sereia com manga longa",
    acceptsWhatsApp: true,
    accepted: undefined,
  },
];

// Senha do admin (mock): "admin123"
export const ADMIN_CREDENTIALS = {
  email: "admin@costureira.com",
  password: "admin123",
};
