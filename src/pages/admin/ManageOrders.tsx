import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ordersAPI } from "@/services/api";
import { Order, OrderStatus } from "@/types";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, typeFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (error) {
      toast.error("Erro ao carregar pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((order) => order.type === typeFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success("Status atualizado com sucesso!");
      loadOrders();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      await ordersAPI.update(orderId, updates);
      toast.success("Pedido atualizado com sucesso!");
      loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error("Erro ao atualizar pedido");
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Gerenciar Pedidos</h1>

      {/* Filtros */}
      <Card className="card-elevated mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Não iniciado">Não iniciado</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Aguardando busca">Aguardando busca</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="conserto">Conserto</SelectItem>
                <SelectItem value="pedido_especial">Pedido Especial</SelectItem>
                <SelectItem value="compra">Compra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">Pedido #{order.id}</h3>
                      <OrderStatusBadge status={order.status} />
                      <span className="text-xs px-2 py-1 bg-muted rounded capitalize">
                        {order.type.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>

                    {order.description && (
                      <p className="text-sm">{order.description}</p>
                    )}

                    {order.notes && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Obs:</strong> {order.notes}
                      </p>
                    )}

                    {order.type === "pedido_especial" && order.accepted === undefined && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateOrder(order.id, { accepted: true })}
                        >
                          Aceitar Pedido
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              Recusar Pedido
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Recusar Pedido</DialogTitle>
                              <DialogDescription>
                                Informe o motivo da recusa do pedido especial
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const reason = formData.get("reason") as string;
                                handleUpdateOrder(order.id, {
                                  accepted: false,
                                  rejectionReason: reason,
                                  status: "Cancelado",
                                });
                              }}
                            >
                              <div className="space-y-4 py-4">
                                <Label htmlFor="reason">Motivo da Recusa</Label>
                                <Textarea
                                  id="reason"
                                  name="reason"
                                  placeholder="Descreva o motivo..."
                                  required
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button type="submit" variant="destructive">
                                  Confirmar Recusa
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <Label className="text-xs">Alterar Status</Label>
                    <Select
                      value={order.status}
                      onValueChange={(value: OrderStatus) =>
                        handleStatusChange(order.id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Não iniciado">Não iniciado</SelectItem>
                        <SelectItem value="Em andamento">Em andamento</SelectItem>
                        <SelectItem value="Aguardando busca">Aguardando busca</SelectItem>
                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
