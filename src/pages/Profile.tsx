import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { User, Mail, Phone, Package, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, orders, refreshOrders } = useApp();

  useEffect(() => {
    refreshOrders();
  }, []);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações do Usuário */}
        <div className="lg:col-span-1">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{currentUser.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{currentUser.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Pedidos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Meus Pedidos</h2>
            <Button onClick={() => navigate("/agendar")}>Novo Conserto</Button>
          </div>

          {orders.length === 0 ? (
            <Card className="card-elevated text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum pedido ainda</h3>
                <p className="text-muted-foreground mb-6">
                  Agende seu primeiro conserto ou faça uma compra
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate("/agendar")}>Agendar Conserto</Button>
                  <Button variant="outline" onClick={() => navigate("/loja")}>
                    Visitar Loja
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {orders.map((order) => (
                <Card key={order.id} className="card-elevated">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">
                          Pedido #{order.id}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </div>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span className="font-medium capitalize">
                          {order.type.replace("_", " ")}
                        </span>
                      </div>
                      {order.description && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Descrição:</span>
                          <span className="font-medium">{order.description}</span>
                        </div>
                      )}
                      {order.totalPrice && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-medium text-primary">
                            R$ {order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => {
                          navigate("/rastrear");
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
