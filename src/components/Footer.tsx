import { Scissors, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Costura & Arte</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Seu ateliê de bairro para consertos, customizações e peças especiais feitas com carinho.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/servicos" className="text-muted-foreground hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/loja" className="text-muted-foreground hover:text-primary transition-colors">
                  Loja
                </Link>
              </li>
              <li>
                <Link to="/rastrear" className="text-muted-foreground hover:text-primary transition-colors">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="text-muted-foreground hover:text-primary transition-colors">
                  Meu Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div className="space-y-4">
            <h3 className="font-semibold">Nossos Serviços</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Conserto de Roupas</li>
              <li>Ajustes e Barras</li>
              <li>Customização</li>
              <li>Peças sob Medida</li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contato</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+55 11 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contato@costuraearte.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Jaraguá do Sul, SC</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Costura & Arte. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
