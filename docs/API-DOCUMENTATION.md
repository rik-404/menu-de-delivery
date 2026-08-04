# 📚 Documentação de API - Serviços JavaScript

## 🗂️ Índice

- [SupabaseService](#supabaseservice)
- [AdminService](#adminservice)
- [CartService](#cartservice)
- [Utils](#utils)
- [Event Listeners](#event-listeners)

---

## 🔧 SupabaseService

Classe principal para comunicação com o Supabase. Gerencia todas as operações CRUD e sincronização de dados.

### **Construtor**

```javascript
class SupabaseService {
    constructor() {
        this.supabase = null;
        this.initialized = false;
    }
}
```

### **Métodos de Inicialização**

#### `init()`
Inicializa a conexão com o Supabase.

```javascript
async init(): Promise<boolean>
```

**Retorno**: `true` se inicializado com sucesso, `false` caso contrário.

**Exemplo**:
```javascript
const success = await supabaseService.init();
if (success) {
    console.log('Supabase conectado!');
}
```

---

### **🍽️ Operações com Menu Items**

#### `getMenuItems()`
Obtém todos os itens do menu ordenados por categoria e nome.

```javascript
async getMenuItems(): Promise<MenuItem[]>
```

**Retorno**: Array de objetos `MenuItem`.

**Exemplo**:
```javascript
const items = await supabaseService.getMenuItems();
console.log('Total de itens:', items.length);
```

#### `addMenuItem(item)`
Adiciona um novo item ao menu.

```javascript
async addMenuItem(item: MenuItem): Promise<MenuItem>
```

**Parâmetros**:
- `item`: Objeto com dados do item (name, price, category, description)

**Retorno**: Item criado com ID.

**Exemplo**:
```javascript
const newItem = await supabaseService.addMenuItem({
    name: 'Pastel de Pizza',
    price: 15.90,
    category: 'pasteis',
    description: 'Mussarela, tomate e orégano'
});
```

#### `updateMenuItem(id, updates)`
Atualiza um item existente.

```javascript
async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem>
```

**Parâmetros**:
- `id`: ID do item a atualizar
- `updates`: Objeto com campos a atualizar

**Exemplo**:
```javascript
const updated = await supabaseService.updateMenuItem(1, {
    price: 17.90,
    description: 'Novo sabor especial!'
});
```

#### `deleteMenuItem(id)`
Remove um item do menu.

```javascript
async deleteMenuItem(id: number): Promise<void>
```

**Parâmetros**:
- `id`: ID do item a remover

**Exemplo**:
```javascript
await supabaseService.deleteMenuItem(1);
console.log('Item removido com sucesso');
```

---

### **⚙️ Operações com Settings**

#### `getSettings()`
Obtém todas as configurações do sistema.

```javascript
async getSettings(): Promise<Setting[]>
```

**Retorno**: Array de configurações.

#### `getSetting(key)`
Obtém uma configuração específica.

```javascript
async getSetting(key: string): Promise<string | null>
```

**Parâmetros**:
- `key`: Chave da configuração

**Exemplo**:
```javascript
const whatsapp = await supabaseService.getSetting('whatsapp_number');
console.log('WhatsApp:', whatsapp);
```

#### `updateSetting(key, value)`
Atualiza uma configuração.

```javascript
async updateSetting(key: string, value: string): Promise<Setting>
```

**Exemplo**:
```javascript
await supabaseService.updateSetting('delivery_fee', '7.50');
```

---

### **📦 Operações com Orders**

#### `addOrder(order)`
Registra um novo pedido.

```javascript
async addOrder(order: Order): Promise<Order>
```

**Parâmetros**:
- `order`: Objeto completo do pedido

**Exemplo**:
```javascript
const order = await supabaseService.addOrder({
    customer_name: 'João Silva',
    customer_phone: '5519987654321',
    items: [
        { name: 'Pastel de Carne', price: 12.90, quantity: 2 }
    ],
    total_amount: 30.80,
    status: 'pending'
});
```

#### `getOrders(filters)`
Obtém pedidos com filtros opcionais.

```javascript
async getOrders(filters?: OrderFilters): Promise<Order[]>
```

**Parâmetros**:
- `filters`: Objeto com filtros (date_from, date_to, status)

#### `updateOrderStatus(id, status)`
Atualiza o status de um pedido.

```javascript
async updateOrderStatus(id: number, status: OrderStatus): Promise<Order>
```

**Status possíveis**: `'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled'`

---

### **🔄 Métodos de Migração**

#### `migrateFromLocalStorage()`
Migra dados do localStorage para o Supabase.

```javascript
async migrateFromLocalStorage(): Promise<boolean>
```

**Exemplo**:
```javascript
const migrated = await supabaseService.migrateFromLocalStorage();
if (migrated) {
    console.log('Migração concluída!');
}
```

---

## 🎛️ AdminService

Funções utilitárias para o painel administrativo.

### **🔐 Autenticação**

#### `checkAuthentication()`
Verifica se o usuário está autenticado.

```javascript
function checkAuthentication(): boolean
```

**Retorno**: `true` se autenticado, `false` caso contrário.

**Comportamento**:
- Verifica sessionStorage
- Valida timeout de 2 horas
- Redireciona para login se necessário

#### `logout()`
Encerra a sessão do usuário.

```javascript
function logout(): void
```

**Comportamento**:
- Limpa sessionStorage
- Redireciona para login.html

#### `resetInactivityTimer()`
Reseta o timer de inatividade (30 minutos).

```javascript
function resetInactivityTimer(): void
```

---

### **📊 Dashboard**

#### `updateDashboardStats()`
Atualiza todas as estatísticas do dashboard.

```javascript
async updateDashboardStats(): Promise<void>
```

**Estatísticas atualizadas**:
- Total de itens no cardápio
- Pedidos do dia
- Faturamento do dia
- Pedidos entregues

#### `updateOrdersChart()`
Atualiza o gráfico de status dos pedidos.

```javascript
async updateOrdersChart(): Promise<void>
```

**Gráfico gerado**: Pizza com distribuição por status

---

### **🍽️ Gestão de Menu**

#### `renderMenuItems()`
Renderiza os itens do menu na interface.

```javascript
function renderMenuItems(): void
```

**Comportamento**:
- Usa o modo de visualização atual (grid/list)
- Aplica filtros ativos
- Adiciona event listeners

#### `searchItems()`
Filtra itens por termo de busca.

```javascript
function searchItems(): void
```

**Busca em**: nome e descrição dos itens

#### `filterByCategory()`
Filtra itens por categoria.

```javascript
function filterByCategory(): void
```

**Categorias disponíveis**:
- `pasteis`
- `bebidas`
- `sobremesas`
- `combos`
- `destaques`

#### `toggleViewMode()`
Alterna entre visualização grid e lista.

```javascript
function toggleViewMode(): void
```

---

### **📦 Gestão de Pedidos**

#### `loadTodayOrders()`
Carrega pedidos do dia atual.

```javascript
async loadTodayOrders(): Promise<void>
```

#### `loadOrdersHistory()`
Carrega histórico de pedidos com filtros.

```javascript
async loadOrdersHistory(): Promise<void>
```

#### `updateOrderStatus(orderId, newStatus)`
Atualiza status de um pedido específico.

```javascript
async updateOrderStatus(orderId: number, newStatus: string): Promise<void>
```

#### `showOrderDetails(orderId)`
Exibe modal com detalhes do pedido.

```javascript
function showOrderDetails(orderId: number): void
```

---

### **⚙️ Configurações**

#### `saveSettings()`
Salva configurações do sistema.

```javascript
async saveSettings(): Promise<void>
```

**Configurações salvas**:
- Título do site
- Taxa de entrega
- Número do WhatsApp

---

## 🛒 CartService

Serviço para gerenciamento do carrinho de compras.

### **Variáveis Globais**

```javascript
let cart = [];                    // Array de itens no carrinho
const CART_STORAGE_KEY = 'pastelaria_cart';
```

### **Funções Principais**

#### `loadCart()`
Carrega carrinho do localStorage.

```javascript
function loadCart(): void
```

#### `saveCart()`
Salva carrinho no localStorage.

```javascript
function saveCart(): void
```

#### `addToCart(item, quantity)`
Adiciona item ao carrinho.

```javascript
function addToCart(item: MenuItem, quantity: number): void
```

#### `removeFromCart(index)`
Remove item do carrinho pelo índice.

```javascript
function removeFromCart(index: number): void
```

#### `updateCartUI()`
Atualiza interface do carrinho.

```javascript
function updateCartUI(): void
```

#### `calculateTotal()`
Calcula valor total do carrinho.

```javascript
function calculateTotal(): number
```

#### `clearCart()`
Limpa todos os itens do carrinho.

```javascript
function clearCart(): void
```

---

## 🛠️ Utils

Funções utilitárias diversas.

### **Formatação**

#### `formatCurrency(value)`
Formata valor para moeda brasileira.

```javascript
function formatCurrency(value: number): string
```

**Exemplo**:
```javascript
formatCurrency(12.90); // "R$ 12,90"
```

#### `formatDate(date)`
Formata data para formato brasileiro.

```javascript
function formatDate(date: Date | string): string
```

**Exemplo**:
```javascript
formatDate(new Date()); // "22/01/2026 15:30"
```

#### `formatPhone(phone)`
Formata número de telefone.

```javascript
function formatPhone(phone: string): string
```

**Exemplo**:
```javascript
formatPhone('5519987654321'); // "(19) 98765-4321"
```

---

### **Validação**

#### `validateCPF(cpf)`
Valida CPF brasileiro.

```javascript
function validateCPF(cpf: string): boolean
```

#### `validatePhone(phone)`
Valida número de telefone.

```javascript
function validatePhone(phone: string): boolean
```

#### `validateEmail(email)`
Valida endereço de e-mail.

```javascript
function validateEmail(email: string): boolean
```

---

### **Notificações**

#### `showNotification(message, type, duration)`
Exibe notificação na interface.

```javascript
function showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number): void
```

**Tipos disponíveis**:
- `success`: Verde ✅
- `error`: Vermelho ❌
- `warning`: Amarelo ⚠️
- `info`: Azul ℹ️

**Exemplo**:
```javascript
showNotification('Pedido confirmado!', 'success', 3000);
```

---

### **WhatsApp**

#### `generateWhatsAppMessage(order)`
Gera mensagem formatada para WhatsApp.

```javascript
function generateWhatsAppMessage(order: Order): string
```

#### `openWhatsApp(phone, message)`
Abre WhatsApp com mensagem pré-formatada.

```javascript
function openWhatsApp(phone: string, message: string): void
```

**Exemplo**:
```javascript
const message = generateWhatsAppMessage(order);
openWhatsApp('5519987654321', message);
```

---

## 🎧 Event Listeners

### **Site Principal**

#### **Navegação por Categorias**
```javascript
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        showCategory(category);
    });
});
```

#### **Controles do Carrinho**
```javascript
// Botões de quantidade
document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', handleQuantityChange);
});

// Botão de adicionar
document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
});
```

#### **Checkout**
```javascript
document.getElementById('checkout-whatsapp').addEventListener('click', () => {
    if (validateCustomerData()) {
        sendOrderViaWhatsApp();
    }
});
```

---

### **Painel Administrativo**

#### **Navegação**
```javascript
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.dataset.section;
        showSection(section);
    });
});
```

#### **Formulários**
```javascript
// Formulário de adicionar item
document.getElementById('add-item-form').addEventListener('submit', handleAddItem);

// Formulário de edição
document.getElementById('edit-form').addEventListener('submit', handleEditItem);

// Formulário de configurações
document.getElementById('settings-form').addEventListener('submit', handleSaveSettings);
```

#### **Modais**
```javascript
// Modal de edição
document.getElementById('edit-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal') {
        closeEditModal();
    }
});
```

---

## 📋 Tipos e Interfaces

### **MenuItem**
```typescript
interface MenuItem {
    id?: number;
    name: string;
    price: number;
    category: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}
```

### **Order**
```typescript
interface Order {
    id?: number;
    customer_name: string;
    customer_phone: string;
    customer_address?: string;
    customer_neighborhood?: string;
    customer_reference?: string;
    customer_observations?: string;
    items: OrderItem[];
    total_amount: number;
    delivery_fee: number;
    payment_method?: string;
    status: OrderStatus;
    whatsapp_message?: string;
    created_at?: string;
    updated_at?: string;
}
```

### **OrderItem**
```typescript
interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    description?: string;
}
```

### **OrderStatus**
```typescript
type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';
```

### **Setting**
```typescript
interface Setting {
    id?: number;
    key: string;
    value: string;
    created_at?: string;
    updated_at?: string;
}
```

---

## 🔧 Configuração

### **Variáveis Globais**

```javascript
// Storage Keys
const CART_STORAGE_KEY = 'pastelaria_cart';
const MENU_ITEMS_STORAGE_KEY = 'pastelaria_menu_items';
const SETTINGS_STORAGE_KEY = 'pastelaria_settings';
const ORDERS_STORAGE_KEY = 'pastelaria_orders';

// Configurações Padrão
const DEFAULT_SETTINGS = {
    whatsapp_number: '5519992450000',
    delivery_fee: '5.00',
    site_title: 'Pastelaria'
};

// Credenciais Admin
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'pastelaria123'
};
```

### **Timeouts**

```javascript
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;  // 30 minutos
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;  // 2 horas
const NOTIFICATION_DURATION = 3000;          // 3 segundos
```

---

## 🐛 Error Handling

### **Tratamento de Erros Supabase**

```javascript
try {
    const data = await supabaseService.getMenuItems();
    return data;
} catch (error) {
    console.error('Erro ao carregar menu:', error);
    showNotification('Erro ao carregar cardápio', 'error');
    return [];
}
```

### **Validação de Dados**

```javascript
function validateMenuItem(item) {
    const errors = [];
    
    if (!item.name || item.name.trim().length < 2) {
        errors.push('Nome do item é obrigatório');
    }
    
    if (!item.price || item.price <= 0) {
        errors.push('Preço deve ser maior que zero');
    }
    
    if (!item.category) {
        errors.push('Categoria é obrigatória');
    }
    
    return errors;
}
```

---

## 📈 Performance

### **Otimizações**

1. **Lazy Loading**: Carregar dados apenas quando necessário
2. **Caching**: Cache local para reduzir requisições
3. **Debouncing**: Delay em buscas e filtros
4. **Virtual Scrolling**: Para grandes listas (futuro)

### **Boas Práticas**

1. **Async/Await**: Usar sempre para operações assíncronas
2. **Error Boundaries**: Tratamento de erros em cascata
3. **Memory Management**: Limpar event listeners
4. **Bundle Size**: Minificar e comprimir assets

---

## 🔄 Ciclo de Vida

### **Inicialização**

1. **DOM Loaded** → Configurar event listeners básicos
2. **Supabase Init** → Conectar com banco de dados
3. **Load Data** → Carregar configurações e menu
4. **Render UI** → Atualizar interface
5. **Start Services** → Iniciar verificações periódicas

### **Destruição**

1. **Cleanup** → Remover event listeners
2. **Save State** → Salvar dados pendentes
3. **Close Connections** → Fechar conexões abertas
4. **Clear Memory** → Limpar variáveis globais

---

## 📞 Suporte

Para dúvidas sobre a API:

1. **Console do Navegador**: Verificar logs e erros
2. **Network Tab**: Inspecionar requisições Supabase
3. **Documentation**: Referência completa do Supabase
4. **GitHub Issues**: Reportar bugs específicos

---

**Última Atualização**: Janeiro/2026  
**Versão**: 1.0.0  
**Compatibilidade**: ES6+, Modern Browsers
