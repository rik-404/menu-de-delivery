<<<<<<< HEAD
# 🥟 Sistema de Pedidos Online - Pastelaria

## 📋 Descrição

Sistema completo de pedidos online para pastelaria, desenvolvido com HTML5, CSS3, JavaScript puro e integrado com Supabase para armazenamento de dados em nuvem. O sistema inclui site para clientes, painel administrativo e gestão completa de pedidos.
=======
# 🍔 Sabor Express | Plataforma de Cardápio Digital & Delivery Interativo

## 📋 Descrição

Plataforma completa de delivery e cardápio digital interativo para restaurantes e lanchonetes. Suporta cadastro de alimentos em memória local (`localStorage`) para testes em tempo real sem dependência de servidor, além de opção de integração com Supabase. Permite expor hamburgueres, pastéis, pizzas, porções, bebidas e sobremesas.
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)

## 🚀 Funcionalidades

### 🛍️ Site Principal (Cliente)
- **Cardápio Digital**: Exibição categorizada de produtos (pastéis, bebidas, sobremesas, combos)
- **Carrinho de Compras**: Sistema completo com adição/remoção de itens
- **Checkout via WhatsApp**: Integração direta com WhatsApp para finalização de pedidos
- **Design Responsivo**: Experiência otimizada para desktop e mobile
- **Navegação por Categorias**: Fácil acesso a diferentes tipos de produtos
- **Benefícios e Promoções**: Seção destacando vantagens e combos especiais

### 🎛️ Painel Administrativo
- **Dashboard**: Visão geral com estatísticas de pedidos e faturamento
- **Gestão de Cardápio**: CRUD completo para itens do menu
- **Gestão de Pedidos**: Acompanhamento de status (pendente, confirmado, entregue)
- **Configurações**: Personalização de WhatsApp, taxa de entrega, etc.
- **Relatórios**: Gráficos e estatísticas em tempo real
- **Autenticação Segura**: Sistema de login para administradores

### 🗄️ Banco de Dados (Supabase)
- **Menu Items**: Armazenamento de produtos com preços e descrições
- **Orders**: Registro completo de pedidos com dados do cliente
- **Settings**: Configurações do sistema
- **RLS**: Row Level Security para controle de acesso
- **Sincronização Real-time**: Atualizações instantâneas entre admin e site

## 📁 Estrutura do Projeto

```
pastelaria-sistema/
├── 📄 index.html              # Redirecionamento para o site principal
├── 📄 admin.html              # Redirecionamento para o painel admin
├── 📄 login.html              # Redirecionamento para a tela de login
├── 📁 src/                    # Código fonte
│   ├── 📁 pages/              # Páginas HTML
│   │   ├── 📄 index.html      # Site principal para clientes
│   │   ├── 📄 admin.html      # Painel administrativo
│   │   └── 📄 login.html      # Tela de login
│   ├── 📁 styles/             # Arquivos CSS
│   │   ├── 📁 pages/          # Estilos das páginas
│   │   └── 📁 components/     # Estilos de componentes
│   └── 📁 scripts/            # Arquivos JavaScript
│       ├── 📁 components/     # Scripts das páginas
│       └── 📁 services/        # Serviços e configurações
├── 📁 assets/                 # Recursos estáticos
│   ├── 📁 images/             # Imagens do projeto
│   └── 📁 audio/              # Arquivos de áudio
├── 📁 config/                 # Arquivos de configuração
├── 📁 scripts/                # Scripts de manutenção
├── 📁 docs/                   # Documentação completa
└── 📄 ESTRUTURA-PASTAS.md     # Guia da estrutura de pastas
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design moderno com animações e responsividade
- **JavaScript ES6+**: Lógica interativa e manipulação DOM
- **Font Awesome**: Ícones e elementos visuais
- **Google Fonts**: Tipografia Poppins

### Backend & Database
- **Supabase**: Banco de dados PostgreSQL como serviço
- **Row Level Security**: Controle de acesso granular
- **Real-time Subscriptions**: Sincronização instantânea

### Integrações
- **WhatsApp API**: Finalização de pedidos via WhatsApp
- **Chart.js**: Gráficos e visualizações de dados

## ⚙️ Configuração do Ambiente

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet para o Supabase
- Conta no Supabase (gratuita)

### Instalação Local

1. **Clone o repositório**
   ```bash
   git clone <URL-DO-REPOSITORIO>
   cd pastelaria
   ```

2. **Configure o Supabase**
   - Siga o guia em `SUPABASE-README.md`
   - Crie um projeto no Supabase
   - Execute o SQL de criação das tabelas
   - Atualize `js/supabase-config.js` com suas chaves

3. **Inicie o servidor local**
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # Ou usando Node.js
   npx serve .
   
   # Ou usando Live Server no VS Code
   ```

4. **Acesse o sistema**
   - Site principal: `http://localhost:8000`
   - Painel admin: `http://localhost:8000/admin.html`
   - Login: `admin` / `pastelaria123`

## 🎯 Funcionalidades Detalhadas

### Site Principal

#### 🗂️ Navegação e Categorias
- **Destaques**: Combos e produtos promocionais
- **Pastéis**: Variedades tradicionais e especiais
- **Bebidas**: Refrigerantes, sucos e outras bebidas
- **Sobremesas**: Doces e sobremesas variadas
- **Combos**: Pacotes promocionais com desconto

#### 🛒 Carrinho de Compras
- **Adicionar Itens**: Quantidade variável por produto
- **Remover Itens**: Exclusão individual ou limpeza total
- **Cálculo Automático**: Subtotal + taxa de entrega
- **Persistência**: Dados mantidos durante a sessão

#### 📱 Finalização de Pedido
- **Dados do Cliente**: Nome, endereço, bairro, referência
- **Validação**: Campos obrigatórios e formato de dados
- **WhatsApp**: Geração automática de mensagem formatada
- **Confirmação**: Redirecionamento para WhatsApp com pedido

### Painel Administrativo

#### 📊 Dashboard
- **Estatísticas em Tempo Real**: Pedidos do dia, faturamento
- **Gráficos Interativos**: Distribuição por status
- **Cards de Status**: Pendentes, confirmados, entregues
- **Indicadores Rápidos**: Itens no cardápio, pedidos hoje

#### 🍽️ Gestão de Cardápio
- **CRUD Completo**: Criar, ler, atualizar, excluir itens
- **Busca e Filtros**: Pesquisa por nome e categoria
- **Visualização Alternativa**: Grid ou lista
- **Validação**: Preços, nomes e descrições

#### 📦 Gestão de Pedidos
- **Status Tracking**: Pendente → Confirmado → Em Entrega → Entregue
- **Detalhes Completos**: Itens, cliente, endereço, observações
- **Ações Rápidas**: Botões para mudança de status
- **Notificações**: Envio de mensagens via WhatsApp
- **Histórico**: Consulta de pedidos por período

#### ⚙️ Configurações
- **WhatsApp**: Número para pedidos
- **Taxa de Entrega**: Valor padrão de delivery
- **Título do Site**: Nome da pastelaria
- **Sincronização**: Salvar automaticamente no Supabase

## 🔐 Segurança

### Autenticação
- **Login por Senha**: Sistema básico de autenticação
- **Session Storage**: Manutenção de sessão ativa
- **Redirecionamento**: Bloqueio de acesso direto não autenticado

### Row Level Security (RLS)
- **Leitura Pública**: Menu e configurações visíveis para todos
- **Escrita Restrita**: Apenas admin pode modificar dados
- **Pedidos Privados**: Acesso restrito a administradores

### Boas Práticas
- **Validação Client-side**: Verificação de dados antes do envio
- **Sanitização**: Limpeza de dados de entrada
- **HTTPS**: Recomendado para produção

## 📱 Responsividade

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Adaptativos
- **Menu Hambúrguer**: Navegação compactada em mobile
- **Grid Flexível**: Layout adaptativo de produtos
- **Formulários**: Campos otimizados para touch
- **Botões**: Áreas de toque adequadas

## 🎨 Design & UX

### Cores e Identidade Visual
- **Paleta Cores**: Cores quentes relacionadas a food
- **Tipografia**: Poppins - moderna e legível
- **Ícones**: Font Awesome para consistência visual
- **Imagens**: Unsplash para placeholders de qualidade

### Animações e Interações
- **Transições Suaves**: Hover states e mudanças de estado
- **Loading States**: Feedback visual durante carregamento
- **Microinterações**: Feedback visual para ações do usuário
- **Notificações**: Alertas contextuais e informativos

## 🔄 Fluxo de Trabalho

### Cliente
1. **Acessa o site** → Visualiza cardápio
2. **Seleciona produtos** → Adiciona ao carrinho
3. **Confirma pedido** → Preenche dados de entrega
4. **Finaliza** → Envia mensagem via WhatsApp
5. **Acompanha** → Recebe atualizações de status

### Administrador
1. **Faz login** → Acessa painel admin
2. **Visualiza pedidos** → Dashboard com estatísticas
3. **Gerencia pedidos** → Atualiza status
4. **Notifica clientes** → Envia atualizações
5. **Gerencia cardápio** → Adiciona/remove produtos

## 🚀 Deploy em Produção

### Opções de Hospedagem
- **Surge.sh**: Gratuito e simples
- **Netlify**: Automatizado com Git
- **Vercel**: Performance otimizada
- **GitHub Pages**: Integrado com repositório
- **Servidor Próprio**: Apache/Nginx

### Configurações de Produção
1. **Variáveis de Ambiente**
   ```bash
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anonima
   ```

2. **Build Otimizado**
   - Minificar CSS e JavaScript
   - Otimizar imagens
   - Configurar cache

3. **HTTPS**
   - Certificado SSL obrigatório
   - Redirecionamento automático

## 🐛 Troubleshooting

### Problemas Comuns

#### Supabase não conecta
- **Verificar**: Chaves de API corretas
- **Solução**: Atualizar `supabase-config.js`
- **Teste**: Abrir console do navegador

#### Login não funciona
- **Verificar**: Credenciais corretas
- **Solução**: Limpar sessionStorage
- **Teste**: Usar admin/pastelaria123

#### Pedidos não aparecem
- **Verificar**: Conexão com Supabase
- **Solução**: Recarregar página
- **Teste**: Verificar console para erros

#### WhatsApp não abre
- **Verificar**: Número configurado
- **Solução**: Formato internacional (+55)
- **Teste**: Clicar no botão de teste

### Debug e Logs
```javascript
// Habilitar debug mode
localStorage.setItem('debug', 'true');

// Verificar conexão Supabase
console.log('Supabase status:', window.supabaseService);

// Verificar carrinho
console.log('Carrinho atual:', JSON.parse(localStorage.getItem('pastelaria_cart')));
```

## 📈 Melhorias Futuras

### Curto Prazo
- [ ] Sistema de avaliações de produtos
- [ ] Integração com gateway de pagamento
- [ ] Notificações push para clientes
- [ ] Histórico de pedidos para clientes

### Médio Prazo
- [ ] App mobile nativo
- [ ] Sistema de fidelidade
- [ ] Integração com delivery apps
- [ ] Analytics avançado

### Longo Prazo
- [ ] Multi-lojas
- [ ] Sistema de estoque
- [ ] Inteligência artificial para recomendações
- [ ] Expansão para franchising

## 📞 Suporte e Contato

### Documentação Relacionada
- `SUPABASE-README.md`: Guia completo do Supabase
- `login.html`: Documentação de autenticação
- `admin.html`: Documentação do painel admin

### Recursos Externos
- [Documentação Supabase](https://supabase.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)
- [Font Awesome](https://fontawesome.com)
- [Chart.js](https://www.chartjs.org)

### Comunidade
- **Issues**: Reportar bugs no repositório
- **Features**: Solicitar novas funcionalidades
- **Contribuições**: Pull requests são bem-vindos

---

## 📜 Licença

<<<<<<< HEAD
© 2026 Vendramini Informática - Pastelaria Itoman

Desenvolvido com ❤️ para a Pastelaria Itoman
=======
© 2026 Sabor Express - Cardápio Digital & Delivery

Desenvolvido para qualquer tipo de estabelecimento de delivery (Hambúrgueres, Pastéis, Pizzas, Porções, Bebidas e Sobremesas).
>>>>>>> 7617e73 (feat: implement admin dashboard UI, Supabase integration, and documentation structure)

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro/2026  
**Status**: ✅ Produção Ativa
