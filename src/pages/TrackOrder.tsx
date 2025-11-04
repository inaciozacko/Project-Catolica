import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersAPI } from "@/services/api";
import { Order } from "@/types";
import { toast } from "sonner";
import { Search, Package } from "lucide-react";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { OrderTimeline } from "@/components/OrderTimeline";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) {
      toast.error("Digite o número do pedido");
      return;
    }

    setIsLoading(true);
    try {
      const foundOrder = await ordersAPI.getById(orderId.trim());
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error("Pedido não encontrado");
        setOrder(null);
      }
    } catch (error) {
      toast.error("Erro ao buscar pedido");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Rastrear Pedido</h1>
        <p className="text-lg text-muted-foreground">
          Digite o número do seu pedido para acompanhar o status
        </p>
      </div>

      <Card className="card-elevated mb-8">
        <CardHeader>
          <CardTitle>Buscar Pedido</CardTitle>
          <CardDescription>
            O número do pedido foi enviado por email ou está disponível no seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Número do Pedido</Label>
              <Input
                id="orderId"
                placeholder="Ex: o_123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Buscando..." : "Buscar Pedido"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {order && (
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Pedido #{order.id}</CardTitle>
                <CardDescription>
                  Criado em {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timeline */}
            <div>
              <h3 className="font-semibold mb-4">Status do Pedido</h3>
              <OrderTimeline currentStatus={order.status} />
            </div>

            {/* Detalhes */}
            <div className="space-y-3">
              <h3 className="font-semibold">Detalhes</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium capitalize">{order.type.replace("_", " ")}</span>
                </div>
                {order.description && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Descrição:</span>
                    <span className="font-medium">{order.description}</span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Previsão de entrega:</span>
                    <span className="font-medium">
                      {format(new Date(order.estimatedDelivery), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
                {order.notes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground block mb-1">Observações:</span>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {order.status === "Aguardando busca" && (
              <div className="bg-secondary/20 border border-secondary p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-secondary-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Pedido pronto para retirada!</p>
                    <p className="text-sm text-muted-foreground">
                      Seu pedido está finalizado e aguardando retirada. Entre em contato para agendar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackOrder;
