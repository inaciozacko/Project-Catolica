import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { ShoppingCart, User, LogOut, Scissors, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const { currentUser, isAdmin, logout, cart } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Scissors className="h-6 w-6" />
          <span>Costura & Arte</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/servicos" className="text-sm font-medium hover:text-primary transition-colors">
            Serviços
          </Link>
          <Link to="/loja" className="text-sm font-medium hover:text-primary transition-colors">
            Loja
          </Link>
          <Link to="/rastrear" className="text-sm font-medium hover:text-primary transition-colors">
            Rastrear Pedido
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/carrinho")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cart.length}
                </Badge>
              )}
            </Button>
          )}

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      <Package className="mr-2 h-4 w-4" />
                      Dashboard Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/pedidos")}>
                      Gerenciar Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/servicos")}>
                      Gerenciar Serviços
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/itens")}>
                      Gerenciar Itens
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/perfil")}>
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Entrar
              </Button>
              <Button onClick={() => navigate("/registro")}>Registrar</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
