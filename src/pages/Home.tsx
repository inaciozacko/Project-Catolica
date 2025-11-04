import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Scissors, Clock, Star, ShoppingBag, Package, Sparkles } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Scissors className="h-8 w-8 text-primary" />,
      title: "Consertos Rápidos",
      description: "Ajustes e consertos de roupas com qualidade e agilidade",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Peças Personalizadas",
      description: "Criamos peças exclusivas sob medida para você",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Entrega Garantida",
      description: "Prazos cumpridos e qualidade assegurada",
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Atendimento Premium",
      description: "Atendimento personalizado e dedicado",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Transforme Suas Roupas com Arte e Dedicação
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Consertos, ajustes e customizações feitas com carinho no seu bairro. Qualidade artesanal com praticidade moderna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg font-semibold"
                onClick={() => navigate("/agendar")}
              >
                <Package className="mr-2 h-5 w-5" />
                Agendar Conserto
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg font-semibold bg-white/10 hover:bg-white/20 text-white border-white/30"
                onClick={() => navigate("/loja")}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Visitar Loja
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por Que Nos Escolher?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Combinamos tradição artesanal com tecnologia moderna para oferecer o melhor serviço
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-elevated border-0">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-muted-foreground text-lg">Do simples ao sofisticado, cuidamos das suas peças</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Consertos</CardTitle>
                <CardDescription>Ajustes de barra, costuras, zíperes e muito mais</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/agendar")}>
                  Agendar Agora
                </Button>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Pedidos Especiais</CardTitle>
                <CardDescription>Peças sob medida feitas especialmente para você</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/pedido-especial")}>
                  Fazer Pedido
                </Button>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Loja</CardTitle>
                <CardDescription>Chaveiros, panos de prato e necessaires artesanais</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary" onClick={() => navigate("/loja")}>
                  Ver Produtos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="gradient-hero text-primary-foreground border-0 p-8 md:p-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Pronto para Começar?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Acompanhe seus pedidos em tempo real e receba notificações sobre cada etapa do processo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg"
                  onClick={() => navigate("/rastrear")}
                >
                  Rastrear Pedido
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg bg-white/10 hover:bg-white/20 text-white border-white/30"
                  onClick={() => navigate("/registro")}
                >
                  Criar Conta
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
