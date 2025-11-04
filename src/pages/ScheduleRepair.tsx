import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { ordersAPI, servicesAPI } from "@/services/api";
import { Service } from "@/types";
import { Upload } from "lucide-react";

const ScheduleRepair = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, refreshOrders } = useApp();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: (location.state?.serviceId as string) || "",
    description: "",
    notes: "",
    preferredDate: "",
    urgency: "média" as "baixa" | "média" | "alta",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await servicesAPI.getAll();
    setServices(data);
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const service = services.find((s) => s.id === formData.serviceId);
      if (!service) {
        toast.error("Serviço não encontrado");
        return;
      }

      // Calcular data estimada de entrega
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + service.estimated_days);

      await ordersAPI.create({
        userId: currentUser.id,
        type: "conserto",
        serviceId: formData.serviceId,
        photos: [],
        status: "Não iniciado",
        description: formData.description,
        notes: formData.notes,
        urgency: formData.urgency,
        preferredDate: formData.preferredDate || undefined,
        estimatedDelivery: estimatedDate.toISOString(),
      });

      await refreshOrders();

      toast.success("Conserto agendado com sucesso!", {
        description: "Você receberá atualizações sobre o andamento",
      });

      navigate("/perfil");
    } catch (error) {
      toast.error("Erro ao agendar conserto. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Agendar Conserto</h1>
        <p className="text-lg text-muted-foreground">
          Preencha os dados do seu conserto e aguarde nosso contato
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Detalhes do Conserto</CardTitle>
          <CardDescription>
            Forneça o máximo de informações possível para um atendimento mais rápido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="service">Serviço *</Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title} - R$ {service.price.toFixed(2)} ({service.estimated_days} dias)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição da Peça *</Label>
              <Input
                id="description"
                placeholder="Ex: Calça jeans azul, tamanho M"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Detalhes do Conserto</Label>
              <Textarea
                id="notes"
                placeholder="Descreva o que precisa ser feito (ex: barra 3cm mais curta, ajustar cintura)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgência</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value: "baixa" | "média" | "alta") =>
                    setFormData({ ...formData, urgency: value })
                  }
                >
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="média">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredDate">Data Preferencial (opcional)</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fotos (em breve)</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload de fotos será habilitado em breve
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Agendando..." : "Agendar Conserto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/servicos")}
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

export default ScheduleRepair;
