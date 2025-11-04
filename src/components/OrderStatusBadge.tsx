import { OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig: Record<OrderStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    "Não iniciado": { variant: "outline", label: "Não iniciado" },
    "Em andamento": { variant: "default", label: "Em andamento" },
    "Aguardando busca": { variant: "secondary", label: "Aguardando busca" },
    "Finalizado": { variant: "default", label: "Finalizado" },
    "Cancelado": { variant: "destructive", label: "Cancelado" },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
};
