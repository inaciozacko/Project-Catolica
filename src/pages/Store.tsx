import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StoreItem } from "@/types";
import { storeItemsAPI } from "@/services/api";
import { useApp } from "@/contexts/AppContext";
import { ShoppingCart, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Store = () => {
  const { addToCart } = useApp();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await storeItemsAPI.getAll();
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (item: StoreItem) => {
    if (item.stock <= 0) {
      toast.error("Item fora de estoque");
      return;
    }
    addToCart(item);
    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  const getTypeBadge = (type: string) => {
    const badges: { [key: string]: { label: string; variant: "default" | "secondary" | "outline" } } = {
      chaveiro: { label: "Chaveiro", variant: "default" },
      pano: { label: "Pano de Prato", variant: "secondary" },
      enc: { label: "Necessaire", variant: "outline" },
      outro: { label: "Outro", variant: "outline" },
    };
    const config = badges[type] || badges.outro;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4 mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
        <h1 className="text-4xl font-bold mb-4">Nossa Loja</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Produtos artesanais feitos com carinho e dedicação
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Nenhum item disponível</CardTitle>
            <CardDescription>Novos produtos em breve!</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="card-elevated flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  {getTypeBadge(item.type)}
                  {item.stock <= 5 && item.stock > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Últimas unidades
                    </Badge>
                  )}
                  {item.stock === 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Esgotado
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    R$ {item.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Estoque: {item.stock}
                  </span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {item.stock === 0 ? "Indisponível" : "Adicionar ao Carrinho"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
