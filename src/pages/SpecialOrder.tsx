import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { ordersAPI } from "@/services/api";
import { Upload } from "lucide-react";

const SpecialOrder = () => {
  const navigate = useNavigate();
  const { currentUser, refreshOrders } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    measurements: "",
    fabric: "",
    reference: "",
    notes: "",
    acceptsWhatsApp: false,
  });

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.measurements) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      await ordersAPI.create({
        userId: currentUser.id,
        type: "pedido_especial",
        photos: [],
        status: "Não iniciado",
        description: formData.description,
        measurements: formData.measurements,
        fabric: formData.fabric,
        reference: formData.reference,
        notes: formData.notes,
        acceptsWhatsApp: formData.acceptsWhatsApp,
        accepted: undefined,
      });

      await refreshOrders();

      toast.success("Pedido especial enviado com sucesso!", {
        description: "Entraremos em contato em breve para confirmar",
      });

      navigate("/perfil");
    } catch (error) {
      toast.error("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pedido Especial</h1>
        <p className="text-lg text-muted-foreground">
          Solicite a confecção de uma peça exclusiva sob medida
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Detalhes da Peça</CardTitle>
          <CardDescription>
            Descreva a peça que deseja confeccionar e enviaremos um orçamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição da Peça *</Label>
              <Textarea
                id="description"
                placeholder="Ex: Vestido longo para festa, com decote em V..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurements">Medidas *</Label>
              <Textarea
                id="measurements"
                placeholder="Busto: 90cm, Cintura: 70cm, Quadril: 95cm, Altura: 165cm..."
                value={formData.measurements}
                onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground">
                Forneça o máximo de medidas possível para um ajuste perfeito
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabric">Tecido Desejado</Label>
              <Input
                id="fabric"
                placeholder="Ex: Crepe, seda, algodão..."
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Referência / Inspiração</Label>
              <Textarea
                id="reference"
                placeholder="Descreva o modelo que serve de inspiração ou cole um link"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações Adicionais</Label>
              <Textarea
                id="notes"
                placeholder="Alguma informação adicional que julgar importante"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Fotos de Referência (em breve)</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload de fotos será habilitado em breve
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsapp"
                checked={formData.acceptsWhatsApp}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, acceptsWhatsApp: checked as boolean })
                }
              />
              <Label htmlFor="whatsapp" className="text-sm font-normal cursor-pointer">
                Aceito ser contatado via WhatsApp para detalhes do pedido
              </Label>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Atenção:</strong> Pedidos especiais estão sujeitos a análise e aprovação.
                Entraremos em contato em até 24 horas com um orçamento detalhado e prazo de entrega.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Pedido"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialOrder;
