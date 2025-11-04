import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Service } from "@/types";
import { servicesAPI } from "@/services/api";
import { Clock, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4 mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Escolha o serviço que precisa e agende seu conserto com praticidade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="card-elevated flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{service.title}</CardTitle>
              <CardDescription className="text-base">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    R$ {service.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{service.estimated_days} dias</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate("/agendar", { state: { serviceId: service.id } })}>
                Agendar Conserto
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="inline-block card-elevated">
          <CardHeader>
            <CardTitle>Precisa de algo diferente?</CardTitle>
            <CardDescription>
              Faça um pedido especial personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" onClick={() => navigate("/pedido-especial")}>
              Fazer Pedido Especial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Services;
