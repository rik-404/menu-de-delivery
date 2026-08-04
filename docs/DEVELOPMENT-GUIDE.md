# 🛠️ Guia de Desenvolvimento e Contribuição

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Setup do Ambiente](#setup-do-ambiente)
- [Estrutura do Código](#estrutura-do-código)
- [Padrões e Convenções](#padrões-e-convenções)
- [Fluxo de Trabalho](#fluxo-de-trabalho)
- [Debug e Testes](#debug-e-testes)
- [Contribuição](#contribuição)
- [Deploy](#deploy)

---

## 🎯 Visão Geral

Este guia orienta desenvolvedores a contribuir com o projeto Pastelaria, seguindo boas práticas e mantendo a qualidade do código.

### **Princípios do Projeto**

1. **Simplicidade**: Código limpo e fácil de entender
2. **Performance**: Otimizado para dispositivos móveis
3. **Acessibilidade**: Usável por todos os públicos
4. **Manutenibilidade**: Fácil de evoluir e corrigir
5. **Segurança**: Proteção de dados e usuários

---

## 🚀 Setup do Ambiente

### **Pré-requisitos**

```bash
# Navegadores suportados
Chrome 90+
Firefox 88+
Safari 14+
Edge 90+

# Ferramentas recomendadas
VS Code + Extensões
Node.js 16+ (para desenvolvimento local)
Git 2.30+
```

### **Extensões VS Code Recomendadas**

```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ritwickdey.liveserver",
    "ms-vscode.vscode-html-css",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### **Setup do Projeto**

```bash
# 1. Clone o repositório
git clone <URL-DO-REPOSITORIO>
cd pastelaria

# 2. Instale dependências (se houver)
npm install

# 3. Configure o Supabase
# Copie SUPABASE-README.md para referência

# 4. Inicie o servidor de desenvolvimento
python -m http.server 8000
# ou
npx serve .

# 5. Abra no navegador
# http://localhost:8000
```

### **Configuração do VS Code**

```json
// .vscode/settings.json
{
  "liveServer.settings.port": 8000,
  "liveServer.settings.root": "/",
  "html.format.indentInnerHtml": true,
  "css.lint.unknownProperties": "warning",
  "javascript.validate.enable": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 📁 Estrutura do Código

### **Organização de Arquivos**

```
pastelaria/
├── 📄 *.html              # Páginas principais
├── 📁 css/                # Estilos organizados
│   ├── style.css         # Site principal
│   ├── admin.css         # Painel admin
│   └── *.css             # Estilos específicos
├── 📁 js/                 # Lógica JavaScript
│   ├── script.js         # Site principal
│   ├── admin.js          # Painel admin
│   ├── supabase-*.js     # Serviços Supabase
│   └── utils.js          # Funções utilitárias
├── 📁 img/                # Imagens e assets
├── 📁 docs/               # Documentação
└── 📁 .windsurf/          # Configurações IDE
```

### **Nomenclatura**

#### **Arquivos**
```bash
# HTML: kebab-case
index.html
admin-panel.html
order-details.html

# CSS: kebab-case
style.css
admin-styles.css
mobile-responsive.css

# JavaScript: kebab-case
script.js
admin-service.js
supabase-config.js
```

#### **Classes CSS**
```css
/* BEM Methodology */
.block { }
.block__element { }
.block--modifier { }

/* Exemplos */
.menu-item { }
.menu-item__title { }
.menu-item--featured { }

.cart { }
.cart__header { }
.cart--empty { }
```

#### **JavaScript**
```javascript
// Variáveis: camelCase
let cartItems = [];
let currentUser = null;
const API_BASE_URL = 'https://api.example.com';

// Funções: camelCase
function addToCart(item) { }
function validatePhoneNumber(phone) { }
function calculateTotalAmount() { }

// Classes: PascalCase
class ShoppingCart { }
class OrderService { }
class NotificationManager { }

// Constantes: UPPER_SNAKE_CASE
const MAX_CART_ITEMS = 50;
const API_TIMEOUT = 5000;
const DEFAULT_CURRENCY = 'BRL';
```

---

## 🎨 Padrões e Convenções

### **HTML**

```html
<!-- Semântico e acessível -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pastelaria - Cardápio Online</title>
    <meta name="description" content="Os melhores pastéis da região">
    
    <!-- CSS em ordem correta -->
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Estrutura semântica -->
    <header class="header">
        <nav class="navigation" role="navigation" aria-label="Menu principal">
            <!-- Conteúdo -->
        </nav>
    </header>
    
    <main class="main-content">
        <!-- Conteúdo principal -->
    </main>
    
    <footer class="footer">
        <!-- Rodapé -->
    </footer>
    
    <!-- Scripts no final do body -->
    <script src="js/utils.js"></script>
    <script src="js/script.js"></script>
</body>
</html>
```

#### **Boas Práticas HTML**

1. **Semântica**: Usar tags HTML5 apropriadas
2. **Acessibilidade**: ARIA labels e roles
3. **Performance**: Scripts no final do body
4. **SEO**: Meta tags descritivas
5. **Validação**: HTML válido W3C

### **CSS**

```css
/* Arquivo: css/style.css */

/* 1. Variáveis CSS */
:root {
    --primary-color: #e74c3c;
    --secondary-color: #3498db;
    --text-color: #333;
    --background-color: #fff;
    --border-radius: 8px;
    --transition: all 0.3s ease;
}

/* 2. Reset/Normalize */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 3. Classes utilitárias */
.text-center { text-align: center; }
.mb-1 { margin-bottom: 0.5rem; }
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
}

/* 4. Componentes */
.menu-item {
    background: var(--background-color);
    border-radius: var(--border-radius);
    padding: 1rem;
    margin-bottom: 1rem;
    transition: var(--transition);
}

.menu-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.menu-item__title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.5rem;
}

/* 5. Responsive Design */
@media (max-width: 768px) {
    .menu-item {
        padding: 0.75rem;
    }
    
    .menu-item__title {
        font-size: 1rem;
    }
}
```

#### **Boas Práticas CSS**

1. **Mobile First**: Começar do mobile para desktop
2. **CSS Variables**: Manter consistência visual
3. **BEM Methodology**: Nomenclatura organizada
4. **Performance**: Evitar reflow e repaint
5. **Maintainability**: Comentários descritivos

### **JavaScript**

```javascript
// Arquivo: js/script.js

// 1. Variáveis globais (mínimas)
let cart = [];
let currentUser = null;

// 2. Constantes de configuração
const CONFIG = {
    API_BASE_URL: 'https://api.supabase.co',
    MAX_CART_ITEMS: 50,
    ANIMATION_DURATION: 300,
    STORAGE_KEYS: {
        CART: 'pastelaria_cart',
        USER: 'pastelaria_user'
    }
};

// 3. Classes e Services
class CartService {
    constructor() {
        this.items = [];
        this.total = 0;
    }
    
    addItem(item, quantity = 1) {
        if (this.items.length >= CONFIG.MAX_CART_ITEMS) {
            throw new Error('Carrinho cheio');
        }
        
        this.items.push({ ...item, quantity });
        this.updateTotal();
        this.saveToStorage();
        this.updateUI();
    }
    
    removeItem(index) {
        this.items.splice(index, 1);
        this.updateTotal();
        this.saveToStorage();
        this.updateUI();
    }
    
    calculateTotal() {
        return this.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
    }
    
    saveToStorage() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CART, 
            JSON.stringify(this.items)
        );
    }
    
    updateUI() {
        // Atualizar interface
        renderCartItems();
        updateCartTotal();
    }
}

// 4. Funções utilitárias
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function validatePhone(phone) {
    const regex = /^\+?55(\d{2})?(\d{9})$/;
    return regex.test(phone.replace(/\D/g, ''));
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 5. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    const cartService = new CartService();
    
    // Carregar dados salvos
    loadSavedData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Inicializar UI
    updateUI();
}

function setupEventListeners() {
    // Botões de adicionar ao carrinho
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
    
    // Formulário de checkout
    document.getElementById('checkout-form')
        ?.addEventListener('submit', handleCheckout);
}

// 6. Handlers de eventos
async function handleAddToCart(event) {
    const btn = event.target;
    const itemData = JSON.parse(btn.dataset.item);
    
    try {
        cartService.addItem(itemData);
        showNotification('Item adicionado ao carrinho!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = {
        customer: Object.fromEntries(formData),
        items: cartService.items,
        total: cartService.calculateTotal()
    };
    
    try {
        await submitOrder(orderData);
        showNotification('Pedido realizado com sucesso!', 'success');
        cartService.clear();
    } catch (error) {
        showNotification('Erro ao realizar pedido', 'error');
    }
}
```

#### **Boas Práticas JavaScript**

1. **ES6+**: Usar features modernas
2. **Async/Await**: Para operações assíncronas
3. **Error Handling**: Try/catch sempre
4. **Modularização**: Separar responsabilidades
5. **Performance**: Evitar memory leaks

---

## 🔄 Fluxo de Trabalho

### **Git Workflow**

```bash
# 1. Criar branch para nova feature
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver com commits pequenos
git add .
git commit -m "feat: adicionar carrinho de compras"

# 3. Push para branch remoto
git push origin feature/nova-funcionalidade

# 4. Criar Pull Request
# Descrever mudanças e solicitar review

# 5. Após aprovação, fazer merge
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

### **Convenção de Commits**

```bash
# Formato: <tipo>(<escopo>): <descrição>

feat: adicionar funcionalidade de busca
fix: corrigir bug no cálculo do total
docs: atualizar documentação da API
style: formatar código CSS
refactor: otimizar performance do carrinho
test: adicionar testes para validação
chore: atualizar dependências
```

### **Code Review Checklist**

#### **Funcionalidade**
- [ ] Feature funciona conforme especificado
- [ ] Edge cases foram tratados
- [ ] Performance aceitável
- [ ] Responsivo em todos dispositivos

#### **Código**
- [ ] Código limpo e legível
- [ ] Segue padrões do projeto
- [ ] Sem código duplicado
- [ ] Comentários quando necessário

#### **Segurança**
- [ ] Validação de entrada de dados
- [ ] Sem exposição de dados sensíveis
- [ ] Proteção contra XSS
- [ ] HTTPS em produção

#### **Testes**
- [ ] Testes unitários criados
- [ ] Testes manuais realizados
- [ ] Cross-browser testado
- [ ] Accessibility testado

---

## 🐛 Debug e Testes

### **Debug no Browser**

```javascript
// 1. Console logging estruturado
console.log('CartService: addItem called', { item, quantity });
console.warn('CartService: cart is full');
console.error('API: request failed', error);

// 2. Debug points
function debugCartState() {
    console.group('Cart State');
    console.log('Items:', cart);
    console.log('Total:', calculateTotal());
    console.log('Count:', cart.length);
    console.groupEnd();
}

// 3. Performance monitoring
console.time('renderCartItems');
renderCartItems();
console.timeEnd('renderCartItems');

// 4. Network requests
fetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
})
.then(response => {
    console.log('API Response:', response);
    return response.json();
})
.catch(error => {
    console.error('API Error:', error);
});
```

### **Testes Manuais**

#### **Checklist de Testes**

**Site Principal**
- [ ] Carregamento em diferentes dispositivos
- [ ] Navegação por categorias funciona
- [ ] Carrinho de compras opera corretamente
- [ ] Formulário de checkout valida dados
- [ ] WhatsApp abre com mensagem correta
- [ ] Responsividade em mobile/tablet/desktop
- [ ] Performance (tempo de carregamento < 3s)
- [ ] Acessibilidade (navegação por teclado)

**Painel Administrativo**
- [ ] Login funciona com credenciais corretas
- [ ] Dashboard exibe estatísticas corretas
- [ ] CRUD de itens do menu funciona
- [ ] Filtros e busca operam corretamente
- [ ] Atualização de status de pedidos funciona
- [ ] Notificações são exibidas adequadamente
- [ ] Configurações são salvas corretamente
- [ ] Logout e timeout de sessão funcionam

### **Testes Automáticos (Futuro)**

```javascript
// Exemplo de testes com Jest
describe('CartService', () => {
    let cartService;
    
    beforeEach(() => {
        cartService = new CartService();
        localStorage.clear();
    });
    
    test('deve adicionar item ao carrinho', () => {
        const item = { name: 'Pastel', price: 12.90 };
        cartService.addItem(item);
        
        expect(cartService.items).toHaveLength(1);
        expect(cartService.items[0]).toEqual(item);
    });
    
    test('deve calcular total corretamente', () => {
        cartService.addItem({ name: 'Item 1', price: 10.00 }, 2);
        cartService.addItem({ name: 'Item 2', price: 5.00 }, 1);
        
        expect(cartService.calculateTotal()).toBe(25.00);
    });
    
    test('deve lançar erro quando carrinho está cheio', () => {
        // Preencher carrinho até o limite
        for (let i = 0; i < CONFIG.MAX_CART_ITEMS; i++) {
            cartService.addItem({ name: `Item ${i}`, price: 1.00 });
        }
        
        expect(() => {
            cartService.addItem({ name: 'Extra', price: 1.00 });
        }).toThrow('Carrinho cheio');
    });
});
```

---

## 🤝 Contribuição

### **Como Contribuir**

1. **Fork o Repositório**
   ```bash
   # Fork no GitHub
   # Clone seu fork
   git clone https://github.com/SEU-USUARIO/pastelaria.git
   ```

2. **Setup do Ambiente**
   ```bash
   cd pastelaria
   npm install
   # Configurar ambiente local
   ```

3. **Desenvolver**
   ```bash
   # Criar branch
   git checkout -b feature/sua-feature
   
   # Desenvolver
   # Testar
   # Documentar
   ```

4. **Submeter**
   ```bash
   git add .
   git commit -m "feat: adicionar nova funcionalidade"
   git push origin feature/sua-feature
   
   # Criar Pull Request
   ```

### **Tipos de Contribuição**

#### **🐛 Bug Reports**
- Descreva o problema detalhadamente
- Passos para reproduzir
- Ambiente (browser, dispositivo)
- Screenshots se aplicável
- Comportamento esperado vs atual

#### **✨ Features**
- Descrição da funcionalidade
- Casos de uso
- Design/mockups se aplicável
- Impacto no sistema

#### **📝 Documentação**
- Correção de erros
- Melhorias na clareza
- Traduções
- Exemplos de código

#### **🎨 Design/UI**
- Melhorias visuais
- Correções de responsividade
- Melhorias de acessibilidade
- Otimizações de performance

### **Pull Request Template**

```markdown
## Descrição
Breve descrição das mudanças implementadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testes
- [ ] Testes manuais realizados
- [ ] Cross-browser testado
- [ ] Mobile testado
- [ ] Accessibility testado

## Checklist
- [ ] Código segue padrões do projeto
- [ ] Self-review realizado
- [ ] Documentação atualizada
- [ ] Sem merge conflicts

## Screenshots (se aplicável)
Adicionar screenshots das mudanças.

## Issues Relacionadas
Closes #123
```

---

## 🚀 Deploy

### **Deploy em Produção**

#### **1. Preparação**
```bash
# 1. Atualizar versão
npm version patch  # ou minor, major

# 2. Build para produção
npm run build

# 3. Testes finais
npm run test
npm run lint
```

#### **2. Deploy Options**

**Surge.sh (Gratuito)**
```bash
# Instalar Surge
npm install -g surge

# Deploy
surge --project . --domain pastelaria-sistema.surge.sh
```

**Netlify (Automatizado)**
```bash
# Conectar repositório GitHub
# Configurar build command: npm run build
# Configurar publish directory: dist
```

**Vercel (Performance)**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**GitHub Pages (Gratuito)**
```bash
# Configurar GitHub Pages
# Branch: main
# Source: Deploy from a branch
# Folder: /docs ou root
```

#### **3. Configurações de Produção**

**Variáveis de Ambiente**
```bash
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# Analytics
VITE_GA_ID=GA_MEASUREMENT_ID

# API
VITE_API_BASE_URL=https://api.pastelaria.com
```

**HTTPS e Security**
```bash
# Configurar SSL/TLS
# Redirecionar HTTP para HTTPS
# Configurar headers de segurança
```

### **Monitoramento**

#### **Performance Monitoring**
```javascript
// Adicionar ao site
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

// Performance API
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
});
```

#### **Error Tracking**
```javascript
// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Enviar para serviço de monitoramento
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
```

#### **Analytics**
```javascript
// Google Analytics (exemplo)
function gtag() {
    dataLayer.push(arguments);
}

// Track page views
gtag('config', 'GA_MEASUREMENT_ID');

// Track events
gtag('event', 'add_to_cart', {
    'item_name': itemName,
    'value': itemPrice
});
```

---

## 📚 Recursos de Aprendizado

### **Documentação**
- [MDN Web Docs](https://developer.mozilla.org)
- [CSS Tricks](https://css-tricks.com)
- [JavaScript.info](https://javascript.info)
- [Supabase Docs](https://supabase.com/docs)

### **Ferramentas**
- [VS Code](https://code.visualstudio.com)
- [Chrome DevTools](https://developers.google.com/web/tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev)

### **Comunidades**
- [Stack Overflow](https://stackoverflow.com)
- [Reddit r/webdev](https://reddit.com/r/webdev)
- [Dev.to](https://dev.to)
- [CSS-Tricks Forum](https://css-tricks.com/forums)

---

## 🎯 Roadmap de Desenvolvimento

### **Sprint 1: Fundamentos**
- [x] Estrutura base do projeto
- [x] Integração com Supabase
- [x] Sistema de autenticação
- [x] Carrinho de compras

### **Sprint 2: Features**
- [x] Painel administrativo
- [x] Gestão de pedidos
- [x] Dashboard com estatísticas
- [x] Notificações em tempo real

### **Sprint 3: Melhorias**
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Integração com gateway pagamento
- [ ] App mobile (PWA)

### **Sprint 4: Escala**
- [ ] Multi-lojas
- [ ] Sistema de estoque
- [ ] Analytics avançado
- [ ] API para terceiros

---

## 📞 Suporte

### **Canais de Comunicação**
- **Issues GitHub**: Para bugs e features
- **Discord**: Para discussões técnicas
- **Email**: Para dúvidas gerais

### **Tempos de Resposta**
- **Crítico**: 24 horas
- **Alto**: 48 horas
- **Normal**: 72 horas
- **Baixo**: 1 semana

---

**Última Atualização**: Janeiro/2026  
**Versão**: 1.0.0  
**Maintainers**: Equipe Vendramini Informática
