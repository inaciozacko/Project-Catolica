import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ordersAPI } from "@/services/api";
import { CheckCircle, CreditCard } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, currentUser, refreshOrders } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  if (cart.length === 0) {
    navigate("/carrinho");
    return null;
  }

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // Simular processamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Criar pedido de compra
      const order = await ordersAPI.create({
        userId: currentUser.id,
        type: "compra",
        items: cart.map((c) => ({ itemId: c.item.id, quantity: c.quantity })),
        photos: [],
        status: "Finalizado",
        notes: "Compra realizada via carrinho",
        totalPrice: cartTotal,
      });

      clearCart();
      await refreshOrders();

      toast.success("Compra realizada com sucesso!", {
        description: `Pedido #${order.id} criado`,
      });

      navigate("/perfil");
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumo do pedido */}
        <div>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    R$ {(item.price * quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">R$ {cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pagamento */}
        <div>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Pagamento (Simulado)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg text-center space-y-4">
                <CreditCard className="h-12 w-12 mx-auto text-primary" />
                <div>
                  <p className="font-medium mb-2">Modo de Demonstração</p>
                  <p className="text-sm text-muted-foreground">
                    Esta é uma simulação de pagamento. Nenhuma transação real será processada.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Pagamento seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Confirmação imediata</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Sem taxas adicionais</span>
                </div>
              </div>

              <Separator />

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  "Processando..."
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Confirmar Pagamento
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/carrinho")}
                disabled={isProcessing}
              >
                Voltar ao Carrinho
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
