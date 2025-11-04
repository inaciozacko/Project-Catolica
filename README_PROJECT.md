# Sistema de Costureira - Costura & Arte

Sistema completo para gestão de ateliê de costura com área pública (clientes) e administrativa.

## 🚀 Funcionalidades

### Área Pública (Clientes)
- ✅ Agendamento de consertos com detalhes e urgência
- ✅ Pedidos especiais sob medida
- ✅ Rastreamento de pedidos por número
- ✅ Loja online com carrinho de compras
- ✅ Checkout simulado
- ✅ Perfil do cliente com histórico de pedidos

### Área Administrativa
- ✅ Dashboard com métricas e estatísticas
- ✅ CRUD completo de Serviços
- ✅ CRUD completo de Itens da loja
- ✅ Gerenciamento de Pedidos com filtros
- ✅ Alteração de status dos pedidos
- ✅ Aceitação/recusa de pedidos especiais

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Router** - Navegação
- **Context API** - Gerenciamento de estado
- **localStorage** - Persistência de dados (mock backend)
- **date-fns** - Manipulação de datas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔐 Credenciais de Teste

**Admin:**
- Email: admin@costureira.com
- Senha: admin123

**Cliente:**
- Crie uma nova conta na página de registro

## 📂 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes shadcn
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── OrderStatusBadge.tsx
│   ├── OrderTimeline.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # Context API
│   └── AppContext.tsx
├── pages/              # Páginas da aplicação
│   ├── admin/         # Páginas administrativas
│   │   ├── Dashboard.tsx
│   │   ├── ManageOrders.tsx
│   │   ├── ManageServices.tsx
│   │   └── ManageItems.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Services.tsx
│   ├── Store.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── TrackOrder.tsx
│   ├── ScheduleRepair.tsx
│   ├── SpecialOrder.tsx
│   └── Profile.tsx
├── services/           # Camada de API (mock)
│   ├── api.ts
│   └── mockData.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🎨 Design System

O projeto utiliza um design system completo com:
- Paleta de cores customizada (azul-anil, rosa-antigo, verde-sálvia)
- Tokens semânticos para cores, gradientes e sombras
- Componentes com variantes
- Responsividade mobile-first
- Suporte a dark mode

## 📊 Mock Backend

Os dados são armazenados no localStorage do navegador:
- `costureira_users` - Usuários
- `costureira_services` - Serviços
- `costureira_store_items` - Itens da loja
- `costureira_orders` - Pedidos
- `costureira_current_user` - Usuário atual
- `costureira_cart` - Carrinho

Para resetar os dados, limpe o localStorage do navegador.

## 🔄 Fluxo de Status dos Pedidos

1. **Não iniciado** - Pedido criado, aguardando início
2. **Em andamento** - Trabalho em execução
3. **Aguardando busca** - Pronto para retirada
4. **Finalizado** - Concluído
5. **Cancelado** - Cancelado pelo admin ou recusado

## 🎯 Próximos Passos (Sugestões)

- Implementar upload real de fotos
- Adicionar notificações por email/WhatsApp
- Integrar com backend real (Supabase)
- Adicionar sistema de pagamento real
- Implementar chat cliente-atendente
- Adicionar mais gráficos no dashboard

## 📝 Licença

Projeto desenvolvido para fins educacionais.
