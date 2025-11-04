import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storeItemsAPI } from "@/services/api";
import { StoreItem, ItemType } from "@/types";
import { toast } from "sonner";
import { Plus, Edit, Trash2, DollarSign, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const ManageItems = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await storeItemsAPI.getAll();
      setItems(data);
    } catch (error) {
      toast.error("Erro ao carregar itens");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const itemData = {
      name: formData.get("name") as string,
      type: formData.get("type") as ItemType,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
    };

    try {
      if (editingItem) {
        await storeItemsAPI.update(editingItem.id, itemData);
        toast.success("Item atualizado com sucesso!");
      } else {
        await storeItemsAPI.create(itemData);
        toast.success("Item criado com sucesso!");
      }
      loadItems();
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error("Erro ao salvar item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      await storeItemsAPI.delete(id);
      toast.success("Item excluído com sucesso!");
      loadItems();
    } catch (error) {
      toast.error("Erro ao excluir item");
    }
  };

  const openDialog = (item?: StoreItem) => {
    setEditingItem(item || null);
    setIsDialogOpen(true);
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

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Gerenciar Itens da Loja</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Editar Item" : "Novo Item"}</DialogTitle>
              <DialogDescription>Preencha as informações do item</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select name="type" defaultValue={editingItem?.type || "outro"}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chaveiro">Chaveiro</SelectItem>
                    <SelectItem value="pano">Pano de Prato</SelectItem>
                    <SelectItem value="enc">Necessaire</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingItem?.price}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={editingItem?.stock}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">{editingItem ? "Atualizar" : "Criar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="card-elevated">
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                {getTypeBadge(item.type)}
                {item.stock <= 5 && item.stock > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Estoque baixo
                  </Badge>
                )}
                {item.stock === 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Esgotado
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-primary">
                    R$ {item.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{item.stock}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDialog(item)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Nenhum item cadastrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageItems;
