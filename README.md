# 🍔 Sabor Express | Cardápio Digital & Delivery Interativo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: Ativo](https://img.shields.io/badge/Status-Ativo-brightgreen.svg)]()
[![Supabase](https://img.shields.io/badge/Database-Supabase-green.svg)](https://supabase.com)

## 📋 Descrição

**Sabor Express** é uma plataforma completa de cardápio digital e delivery interativo projetada para restaurantes, lanchonetes, pastelarias, hamburguerias e estabelecimentos gastronômicos.

O sistema opera com suporte híbrido de persistência de dados:
1. **Modo Local (`localStorage`)**: Permite cadastrar e testar itens e pedidos instantaneamente no navegador sem necessidade de servidor backend.
2. **Modo Nuvem (`Supabase`)**: Conexão com banco de dados PostgreSQL, sincronização em tempo real e segurança de dados via Row Level Security (RLS).

---

## 🚀 Funcionalidades

### 🛍️ Site Principal (Cliente)
- **Cardápio Digital Categorizado**: Filtros por Destaques, Burgers, Pastéis, Pizzas, Porções, Bebidas, Sobremesas e Combos.
- **Carrinho de Compras Interativo**: Adição/remoção de itens, cálculo de subtotal e taxa de entrega em tempo real.
- **Checkout via WhatsApp**: Formatação e envio automático dos detalhes do pedido para o WhatsApp do estabelecimento.
- **Design Responsivo e Moderno**: Interface elegante com micro-animações, otimizada para mobile, tablet e desktop.
- **Seção de Ofertas & Vantagens**: Destaque de promoções, cupons e diferenciais da casa.

### 🎛️ Painel Administrativo
- **Dashboard em Tempo Real**: Estatísticas de vendas, número de pedidos do dia e faturamento total.
- **Gestão de Cardápio (CRUD)**: Adição, edição, remoção e alternância de disponibilidade de produtos.
- **Gestão de Pedidos**: Acompanhamento de status (*Pendente* → *Confirmado* → *Em Entrega* → *Entregue*).
- **Notificações Automáticas**: Notificação sonora de novos pedidos e integração com WhatsApp do cliente.
- **Configurações Gerais**: Edição do número do WhatsApp, taxa de entrega, nome do estabelecimento e chaves Supabase.
- **Autenticação Segura**: Login administrativo com proteção de rotas e expiração de sessão.

### 🗄️ Banco de Dados (Supabase)
- **Tabelas Otimizadas**: `menu_items`, `orders`, `settings`.
- **Row Level Security (RLS)**: Leitura pública para o cardápio e permissões restritas de escrita para administradores.
- **Real-time Subscriptions**: Atualizações instantâneas no painel quando novos pedidos são realizados.

---

## 📁 Estrutura do Projeto

```
menu-de-delivery/
├── 📄 index.html                 # Redirecionamento para o site principal (src/pages/index.html)
├── 📄 admin.html                 # Redirecionamento para o painel admin (src/pages/admin.html)
├── 📄 login.html                 # Redirecionamento para a tela de login (src/pages/login.html)
├── 📄 README.md                  # Documentação principal
├── 📄 CHANGELOG.md               # Histórico de versões e alterações
├── 📄 ESTRUTURA-PASTAS.md         # Guia detalhado da estrutura do repositório
├── 📄 SUPABASE-README.md         # Guia de configuração e script SQL do Supabase
├── 📁 src/                       # Código fonte da aplicação
│   ├── 📁 pages/                 # Páginas HTML da aplicação
│   │   ├── 📄 index.html         # Site principal do cliente / cardápio
│   │   ├── 📄 admin.html         # Painel de controle administrativo
│   │   ├── 📄 login.html         # Tela de autenticação admin
│   │   └── 📄 test-supabase-connection.html # Teste de conexão Supabase
│   ├── 📁 styles/                # Estilos CSS (puro / modulado)
│   │   ├── 📁 pages/             # Estilos específicos de página (style.css, admin.css, login.css)
│   │   └── 📁 components/        # Estilos reutilizáveis (modais, tabelas, notificações)
│   └── 📁 scripts/               # Lógica em JavaScript (ES6+)
│       ├── 📁 components/        # Lógica das páginas (script.js, admin.js)
│       └── 📁 services/          # Serviços Supabase (supabase-config.js, supabase-service.js)
├── 📁 assets/                    # Recursos multimídia estáticos
│   ├── 📁 images/                # Logos e imagens de produtos
│   └── 📁 audio/                 # Arquivos de áudio para notificações
├── 📁 config/                    # Scripts SQL e correções de RLS
├── 📁 scripts/                   # Scripts utilitários de manutenção
└── 📁 docs/                      # Documentação técnica estendida (API, DB Schema, Testes)
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Semântico e acessível.
- **CSS3**: Layouts flexíveis (Flexbox & CSS Grid), variáveis CSS, micro-animações e design responsivo.
- **JavaScript (ES6+)**: Manipulação de DOM nativa, consumo de APIs assíncronas (Fetch / Supabase JS SDK).
- **Font Awesome 6**: Ícones vetoriais modernos.
- **Google Fonts**: Tipografia *Poppins*.

### Backend & Nuvem (Opcional)
- **Supabase**: Backend-as-a-Service com PostgreSQL.
- **Row Level Security (RLS)**: Controle de permissões granular.
- **Real-time Engine**: Sincronização via WebSockets.

### Integrações & Bibliotecas
- **WhatsApp API**: Finalização de pedidos diretamente na conversa do WhatsApp.
- **Chart.js**: Gráficos estatísticos no painel administrativo.

---

## ⚙️ Configuração e Execução Local

### Pré-requisitos
- Navegador web atualizado (Chrome, Firefox, Edge, Safari).
- Servidor web simples (Live Server no VS Code, `python -m http.server`, ou `npx serve`).

### Passo a Passo

1. **Clonar o Repositório**
   ```bash
   git clone git@github.com:rik-404/menu-de-delivery.git
   cd menu-de-delivery
   ```

2. **Executar um Servidor Local**
   ```bash
   # Opção 1: Usando Python
   python -m http.server 8000

   # Opção 2: Usando Node.js
   npx serve .
   ```

3. **Acessar as Páginas**
   - **Cardápio Digital (Cliente)**: `http://localhost:8000/`
   - **Painel Administrativo**: `http://localhost:8000/admin.html`
   - **Login Admin**: `http://localhost:8000/login.html`
   - **Credenciais padrão**: Usuário: `admin` | Senha: `admin123` (ou conforme configurado)

4. **Configurar Conexão com Supabase (Opcional)**
   - Caso deseje utilizar persistência em nuvem, siga as instruções contidas em [`SUPABASE-README.md`](SUPABASE-README.md).
   - Insira as credenciais do seu projeto em [`src/scripts/services/supabase-config.js`](src/scripts/services/supabase-config.js).

---

## 🔐 Segurança & Boas Práticas

- **Session Management**: O painel administrativo requer autenticação ativa com expiração automática.
- **Proteção RLS**: Consultas de clientes acessam apenas dados liberados (cardápio e configurações de exibição).
- **Sanitização de Entradas**: Prevenção de XSS e validação de formulários antes do envio.

---

## 📱 Responsividade

O sistema é construído no conceito **Mobile-First**, garantindo excelente navegação tanto em aparelhos de tela reduzida (smartphones de 320px+) quanto em monitores ultra-wide.

---

## 📜 Licença

© 2026 Sabor Express - Cardápio Digital & Delivery  
Desenvolvido com foco em alta performance e excelente experiência do usuário.
