# 🗄️ Estrutura de Dados e Modelos

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tabelas do Banco](#tabelas-do-banco)
- [Relacionamentos](#relacionamentos)
- [Índices e Performance](#índices-e-performance)
- [Row Level Security](#row-level-security)
- [Migrations](#migrations)
- [Models JavaScript](#models-javascript)

---

## 🎯 Visão Geral

O sistema utiliza **Supabase** (PostgreSQL) como banco de dados principal, com suporte a localStorage como fallback. A estrutura foi projetada para escalabilidade, performance e segurança.

### **Princípios de Design**

1. **Normalização**: Evitar redundância de dados
2. **Performance**: Índices otimizados para consultas frequentes
3. **Segurança**: RLS para controle granular de acesso
4. **Flexibilidade**: Estrutura extensível para futuras funcionalidades
5. **Consistência**: Padrões de nomenclatura e tipos de dados

---

## 📊 Tabelas do Banco

### **1. menu_items**

Armazena todos os produtos disponíveis no cardápio.

```sql
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Campos Detalhados**

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | SERIAL | ID único auto-incremento | 1 |
| `name` | TEXT | Nome do produto (obrigatório) | "Pastel de Carne" |
| `price` | DECIMAL(10,2) | Preço com 2 casas decimais | 12.90 |
| `category` | TEXT | Categoria do produto | "pasteis" |
| `description` | TEXT | Descrição detalhada | "Carne moída temperada" |
| `image_url` | TEXT | URL da imagem do produto | "https://..." |
| `is_available` | BOOLEAN | Disponibilidade para venda | true |
| `sort_order` | INTEGER | Ordem de exibição | 1 |
| `created_at` | TIMESTAMP | Data de criação | 2026-01-22 15:30:00 |
| `updated_at` | TIMESTAMP | Última atualização | 2026-01-22 15:30:00 |

#### **Categorias Possíveis**

```sql
-- Valores válidos para o campo 'category'
VALUES ('pasteis'),      -- Pastéis tradicionais e especiais
       ('bebidas'),       -- Refrigerantes, sucos, etc.
       ('sobremesas'),    -- Doces e sobremesas
       ('combos'),        -- Pacotes promocionais
       ('destaques');     -- Produtos em destaque
```

#### **Constraints**

```sql
-- Nome único por categoria
ALTER TABLE menu_items ADD CONSTRAINT unique_name_per_category 
    UNIQUE (name, category);

-- Preço positivo
ALTER TABLE menu_items ADD CONSTRAINT positive_price 
    CHECK (price > 0);

-- Categoria válida
ALTER TABLE menu_items ADD CONSTRAINT valid_category 
    CHECK (category IN ('pasteis', 'bebidas', 'sobremesas', 'combos', 'destaques'));
```

---

### **2. settings**

Armazena configurações do sistema em formato chave-valor.

```sql
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Campos Detalhados**

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | SERIAL | ID único | 1 |
| `key` | TEXT | Chave única (obrigatória) | "whatsapp_number" |
| `value` | TEXT | Valor da configuração | "5519992450000" |
| `description` | TEXT | Descrição da configuração | "Número para pedidos" |
| `is_public` | BOOLEAN | Se é pública (leitura) | false |
| `created_at` | TIMESTAMP | Data de criação | 2026-01-22 15:30:00 |
| `updated_at` | TIMESTAMP | Última atualização | 2026-01-22 15:30:00 |

#### **Configurações Padrão**

```sql
INSERT INTO settings (key, value, description, is_public) VALUES
('whatsapp_number', '5519992450000', 'Número do WhatsApp para pedidos', true),
('delivery_fee', '5.00', 'Taxa padrão de entrega', true),
('site_title', 'Pastelaria', 'Título do site', true),
('admin_email', 'admin@pastelaria.com', 'E-mail do administrador', false),
('business_hours', '08:00-22:00', 'Horário de funcionamento', true),
('min_order_value', '0.00', 'Valor mínimo para pedido', true),
('delivery_radius', '15', 'Raio de entrega em km', false);
```

---

### **3. orders**

Registra todos os pedidos realizados no sistema.

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    customer_address TEXT,
    customer_neighborhood TEXT,
    customer_city TEXT DEFAULT 'Piracicaba',
    customer_state TEXT DEFAULT 'SP',
    customer_cep TEXT,
    customer_reference TEXT,
    customer_observations TEXT,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 5.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    status TEXT DEFAULT 'pending',
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    delivery_person TEXT,
    whatsapp_message TEXT,
    customer_notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Campos Detalhados**

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | SERIAL | ID único do pedido | 1001 |
| `customer_name` | TEXT | Nome completo do cliente | "João Silva" |
| `customer_phone` | TEXT | Telefone com DDD | "5519987654321" |
| `customer_email` | TEXT | E-mail do cliente | "joao@email.com" |
| `customer_address` | TEXT | Endereço de entrega | "Rua das Flores, 123" |
| `customer_neighborhood` | TEXT | Bairro | "Centro" |
| `customer_city` | TEXT | Cidade (padrão: Piracicaba) | "Piracicaba" |
| `customer_state` | TEXT | Estado (padrão: SP) | "SP" |
| `customer_cep` | TEXT | CEP | "13400-000" |
| `customer_reference` | TEXT | Ponto de referência | "Próximo à praça" |
| `customer_observations` | TEXT | Observações do pedido | "Sem cebola" |
| `items` | JSONB | Array de itens do pedido | `[{"name": "...", ...}]` |
| `subtotal` | DECIMAL(10,2) | Subtotal dos itens | 25.80 |
| `delivery_fee` | DECIMAL(10,2) | Taxa de entrega | 5.00 |
| `total_amount` | DECIMAL(10,2) | Valor total | 30.80 |
| `payment_method` | TEXT | Método de pagamento | "whatsapp" |
| `payment_status` | TEXT | Status do pagamento | "pending" |
| `status` | TEXT | Status do pedido | "pending" |
| `estimated_delivery_time` | TIMESTAMP | Previsão de entrega | 2026-01-22 18:00:00 |
| `actual_delivery_time` | TIMESTAMP | Entrega real | 2026-01-22 17:45:00 |
| `delivery_person` | TEXT | Entregador responsável | "Pedro" |
| `whatsapp_message` | TEXT | Mensagem enviada | "Seu pedido foi..." |
| `customer_notified` | BOOLEAN | Cliente foi notificado | true |
| `created_at` | TIMESTAMP | Data do pedido | 2026-01-22 15:30:00 |
| `updated_at` | TIMESTAMP | Última atualização | 2026-01-22 15:30:00 |

#### **Estrutura JSON dos Items**

```json
{
    "items": [
        {
            "id": 1,
            "name": "Pastel de Carne",
            "price": 12.90,
            "quantity": 2,
            "subtotal": 25.80,
            "description": "Carne moída temperada",
            "category": "pasteis"
        },
        {
            "id": 15,
            "name": "Refrigerante 2L",
            "price": 12.00,
            "quantity": 1,
            "subtotal": 12.00,
            "description": "Coca-Cola 2L",
            "category": "bebidas"
        }
    ]
}
```

#### **Status Possíveis**

```sql
-- Valores válidos para 'status'
VALUES ('pending'),      -- Aguardando confirmação
       ('confirmed'),     -- Confirmado pela cozinha
       ('preparing'),     -- Em preparação
       ('ready'),         -- Pronto para entrega
       ('delivering'),    -- Saiu para entrega
       ('delivered'),     -- Entregue com sucesso
       ('cancelled'),     -- Cancelado pelo cliente
       ('refunded');      -- Reembolsado
```

#### **Métodos de Pagamento**

```sql
-- Valores válidos para 'payment_method'
VALUES ('whatsapp'),     -- Pedido via WhatsApp
       ('cash'),          -- Dinheiro na entrega
       ('card'),          -- Cartão na entrega
       ('pix'),           -- PIX
       ('online');        -- Gateway online
```

---

### **4. order_status_history**

Histórico de mudanças de status dos pedidos (auditoria).

```sql
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT,
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### **5. customers**

Cadastro de clientes para programa de fidelidade (futuro).

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    birth_date DATE,
    address TEXT,
    neighborhood TEXT,
    city TEXT DEFAULT 'Piracicaba',
    state TEXT DEFAULT 'SP',
    cep TEXT,
    loyalty_points INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    preferred_payment_method TEXT,
    observations TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 Relacionamentos

### **Diagrama de Relacionamentos**

```
┌─────────────────┐    ┌─────────────────┐
│   menu_items    │    │     orders      │
│                 │    │                 │
│ id (PK)         │    │ id (PK)         │
│ name            │    │ customer_name   │
│ price           │    │ customer_phone  │
│ category        │    │ items (JSONB)   │
│ description     │    │ total_amount    │
│ ...             │    │ status          │
└─────────────────┘    │ ...             │
                       └─────────────────┘
                                │
                                │
                       ┌─────────────────┐
                       │order_status_hist│
                       │                 │
                       │ id (PK)         │
                       │ order_id (FK)   │
                       │ old_status      │
                       │ new_status      │
                       │ ...             │
                       └─────────────────┘

┌─────────────────┐    ┌─────────────────┐
│    settings     │    │    customers    │
│                 │    │                 │
│ id (PK)         │    │ id (PK)         │
│ key (UNIQUE)    │    │ name            │
│ value           │    │ phone (UNIQUE)  │
│ description     │    │ email (UNIQUE)  │
│ is_public       │    │ loyalty_points  │
│ ...             │    │ total_orders    │
└─────────────────┘    │ ...             │
                       └─────────────────┘
```

### **Relacionamentos Detalhados**

#### **orders → order_status_history**
- **Tipo**: One-to-Many
- **Chave**: `orders.id` → `order_status_history.order_id`
- **Cascade**: DELETE CASCADE (remove histórico ao remover pedido)

#### **orders → customers** (futuro)
- **Tipo**: Many-to-One
- **Chave**: `orders.customer_phone` → `customers.phone`
- **Relação**: Via telefone (identificação única)

---

## 🚀 Índices e Performance

### **Índices Primários**

```sql
-- menu_items
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_name ON menu_items(name);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_sort_order ON menu_items(category, sort_order);

-- settings
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_public ON settings(is_public);

-- orders
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_total_amount ON orders(total_amount);
CREATE INDEX idx_orders_date_status ON orders(created_at, status);

-- order_status_history
CREATE INDEX idx_order_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_history_created_at ON order_status_history(created_at);

-- customers (futuro)
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_loyalty ON customers(loyalty_points DESC);
```

### **Índices Compostos**

```sql
-- Performance para dashboard
CREATE INDEX idx_orders_dashboard ON orders(created_at DESC, status, total_amount);

-- Performance para busca de pedidos
CREATE INDEX idx_orders_search ON orders(customer_name, customer_phone, created_at DESC);

-- Performance para menu por categoria
CREATE INDEX idx_menu_items_category_available ON menu_items(category, is_available, sort_order);
```

### **Análise de Performance**

```sql
-- Verificar uso de índices
EXPLAIN ANALYZE SELECT * FROM orders 
WHERE created_at >= '2026-01-22' 
AND status = 'pending' 
ORDER BY created_at DESC;

-- Estatísticas da tabela
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename IN ('menu_items', 'orders', 'settings');
```

---

## 🔒 Row Level Security (RLS)

### **Políticas de Segurança**

#### **menu_items**
```sql
-- Habilitar RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Leitura pública (qualquer um pode ver o cardápio)
CREATE POLICY "Public read access for menu_items" ON menu_items 
FOR SELECT USING (true);

-- Escrita apenas para admin
CREATE POLICY "Admin write access for menu_items" ON menu_items 
FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
);
```

#### **settings**
```sql
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Leitura pública para configurações públicas
CREATE POLICY "Public read access for public settings" ON settings 
FOR SELECT USING (is_public = true);

-- Leitura admin para todas
CREATE POLICY "Admin read access for all settings" ON settings 
FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
);

-- Escrita apenas admin
CREATE POLICY "Admin write access for settings" ON settings 
FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
);
```

#### **orders**
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Acesso completo apenas para admin
CREATE POLICY "Admin full access for orders" ON orders 
FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
);

-- Cliente pode ver apenas seus pedidos (futuro)
CREATE POLICY "Customer read own orders" ON orders 
FOR SELECT USING (
    auth.jwt() ->> 'phone' = customer_phone
);
```

### **Funções de Autenticação**

```sql
-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.jwt() ->> 'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se é o cliente
CREATE OR REPLACE FUNCTION is_customer() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.jwt() ->> 'phone' = customer_phone;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🔄 Migrations

### **Migration Inicial**

```sql
-- migration: 001_initial_schema.sql
-- Criar tabelas básicas

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    customer_neighborhood TEXT,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 5.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Migration: Adicionar Campos de Endereço**

```sql
-- migration: 002_add_address_fields.sql
ALTER TABLE orders ADD COLUMN customer_email TEXT;
ALTER TABLE orders ADD COLUMN customer_city TEXT DEFAULT 'Piracicaba';
ALTER TABLE orders ADD COLUMN customer_state TEXT DEFAULT 'SP';
ALTER TABLE orders ADD COLUMN customer_cep TEXT;
ALTER TABLE orders ADD COLUMN customer_reference TEXT;
ALTER TABLE orders ADD COLUMN customer_observations TEXT;
```

### **Migration: Adicionar Histórico**

```sql
-- migration: 003_add_order_history.sql
CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT,
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Migration: Adicionar Imagens**

```sql
-- migration: 004_add_images.sql
ALTER TABLE menu_items ADD COLUMN image_url TEXT;
ALTER TABLE menu_items ADD COLUMN image_alt TEXT;
```

---

## 📱 Models JavaScript

### **MenuItem Model**

```javascript
class MenuItem {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.price = parseFloat(data.price) || 0;
        this.category = data.category || '';
        this.description = data.description || '';
        this.image_url = data.image_url || '';
        this.image_alt = data.image_alt || '';
        this.is_available = data.is_available !== false;
        this.sort_order = parseInt(data.sort_order) || 0;
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    // Validação
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (this.price <= 0) {
            errors.push('Preço deve ser maior que zero');
        }
        
        const validCategories = ['pasteis', 'bebidas', 'sobremesas', 'combos', 'destaques'];
        if (!validCategories.includes(this.category)) {
            errors.push('Categoria inválida');
        }
        
        return errors;
    }

    // Formatação
    getFormattedPrice() {
        return formatCurrency(this.price);
    }

    // Serialização
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            category: this.category,
            description: this.description,
            image_url: this.image_url,
            image_alt: this.image_alt,
            is_available: this.is_available,
            sort_order: this.sort_order
        };
    }
}
```

### **Order Model**

```javascript
class Order {
    constructor(data = {}) {
        this.id = data.id || null;
        this.customer_name = data.customer_name || '';
        this.customer_phone = data.customer_phone || '';
        this.customer_email = data.customer_email || '';
        this.customer_address = data.customer_address || '';
        this.customer_neighborhood = data.customer_neighborhood || '';
        this.customer_city = data.customer_city || 'Piracicaba';
        this.customer_state = data.customer_state || 'SP';
        this.customer_cep = data.customer_cep || '';
        this.customer_reference = data.customer_reference || '';
        this.customer_observations = data.customer_observations || '';
        
        this.items = data.items || [];
        this.subtotal = parseFloat(data.subtotal) || 0;
        this.delivery_fee = parseFloat(data.delivery_fee) || 5.00;
        this.total_amount = parseFloat(data.total_amount) || 0;
        
        this.payment_method = data.payment_method || 'whatsapp';
        this.payment_status = data.payment_status || 'pending';
        this.status = data.status || 'pending';
        
        this.estimated_delivery_time = data.estimated_delivery_time || null;
        this.actual_delivery_time = data.actual_delivery_time || null;
        this.delivery_person = data.delivery_person || '';
        
        this.whatsapp_message = data.whatsapp_message || '';
        this.customer_notified = data.customer_notified || false;
        
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    // Cálculos
    calculateSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateTotal() {
        return this.subtotal + this.delivery_fee;
    }

    // Validação
    validate() {
        const errors = [];
        
        if (!this.customer_name || this.customer_name.trim().length < 3) {
            errors.push('Nome do cliente é obrigatório');
        }
        
        if (!this.customer_phone || !validatePhone(this.customer_phone)) {
            errors.push('Telefone inválido');
        }
        
        if (!this.items || this.items.length === 0) {
            errors.push('Pedido deve ter pelo menos um item');
        }
        
        if (this.total_amount <= 0) {
            errors.push('Valor total deve ser maior que zero');
        }
        
        return errors;
    }

    // Status
    canUpdateStatus(newStatus) {
        const statusFlow = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['preparing', 'cancelled'],
            'preparing': ['ready', 'cancelled'],
            'ready': ['delivering'],
            'delivering': ['delivered'],
            'delivered': [],
            'cancelled': []
        };
        
        return statusFlow[this.status]?.includes(newStatus) || false;
    }

    // Formatação
    getFormattedTotal() {
        return formatCurrency(this.total_amount);
    }

    getFormattedDate() {
        return formatDate(this.created_at);
    }

    // Serialização
    toJSON() {
        return {
            id: this.id,
            customer_name: this.customer_name,
            customer_phone: this.customer_phone,
            customer_address: this.customer_address,
            customer_neighborhood: this.customer_neighborhood,
            items: this.items,
            subtotal: this.subtotal,
            delivery_fee: this.delivery_fee,
            total_amount: this.total_amount,
            status: this.status,
            created_at: this.created_at
        };
    }
}
```

### **Setting Model**

```javascript
class Setting {
    constructor(data = {}) {
        this.id = data.id || null;
        this.key = data.key || '';
        this.value = data.value || '';
        this.description = data.description || '';
        this.is_public = data.is_public || false;
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    // Validação
    validate() {
        const errors = [];
        
        if (!this.key || this.key.trim().length === 0) {
            errors.push('Chave é obrigatória');
        }
        
        if (!this.value && this.value !== '0') {
            errors.push('Valor é obrigatório');
        }
        
        // Validação específica por chave
        if (this.key === 'whatsapp_number' && !validatePhone(this.value)) {
            errors.push('Número de WhatsApp inválido');
        }
        
        if (this.key === 'delivery_fee' && parseFloat(this.value) < 0) {
            errors.push('Taxa de entrega não pode ser negativa');
        }
        
        return errors;
    }

    // Tipos
    getType() {
        const numberKeys = ['delivery_fee', 'min_order_value', 'delivery_radius'];
        const booleanKeys = ['notifications_enabled', 'delivery_available'];
        
        if (numberKeys.includes(this.key)) return 'number';
        if (booleanKeys.includes(this.key)) return 'boolean';
        return 'string';
    }

    getTypedValue() {
        switch (this.getType()) {
            case 'number':
                return parseFloat(this.value) || 0;
            case 'boolean':
                return this.value === 'true';
            default:
                return this.value;
        }
    }
}
```

---

## 📊 Estatísticas e Relatórios

### **Views para Relatórios**

```sql
-- View: Resumo diário de vendas
CREATE VIEW daily_sales_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders
FROM orders
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View: Produtos mais vendidos
CREATE VIEW top_selling_items AS
SELECT 
    item->>'name' as item_name,
    item->>'category' as category,
    SUM((item->>'quantity')::integer) as total_quantity,
    SUM((item->>'quantity')::integer * (item->>'price')::decimal) as total_revenue
FROM orders, jsonb_array_elements(items) as item
WHERE status = 'delivered'
GROUP BY item->>'name', item->>'category'
ORDER BY total_quantity DESC;

-- View: Clientes fiéis (futuro)
CREATE VIEW loyal_customers AS
SELECT 
    customer_phone,
    customer_name,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_spent,
    AVG(total_amount) as average_order
FROM orders
WHERE status = 'delivered'
GROUP BY customer_phone, customer_name
ORDER BY total_spent DESC;
```

---

## 🔧 Manutenção do Banco

### **Backup e Restore**

```sql
-- Backup completo
pg_dump -h localhost -U postgres -d pastelaria_db > backup.sql

-- Restore
psql -h localhost -U postgres -d pastelaria_db < backup.sql

-- Backup apenas dados
pg_dump -h localhost -U postgres -d pastelaria_db --data-only > data_backup.sql
```

### **Limpeza e Otimização**

```sql
-- Limpar pedidos antigos (manter últimos 90 dias)
DELETE FROM orders 
WHERE created_at < NOW() - INTERVAL '90 days'
AND status IN ('delivered', 'cancelled');

-- Otimizar tabelas
VACUUM ANALYZE menu_items;
VACUUM ANALYZE orders;
VACUUM ANALYZE settings;

-- Recriar índices se necessário
REINDEX TABLE orders;
```

### **Monitoramento**

```sql
-- Tamanho das tabelas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Queries lentas
SELECT 
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements 
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 📈 Escalabilidade

### **Estratégias de Escala**

1. **Horizontal**: Multiple read replicas
2. **Vertical**: Upgrade de recursos do servidor
3. **Partitioning**: Divisão de tabelas por data
4. **Caching**: Redis para dados frequentes
5. **CDN**: Para imagens e assets estáticos

### **Partitioning (Futuro)**

```sql
-- Particionar orders por mês
CREATE TABLE orders_y2026m01 PARTITION OF orders
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE orders_y2026m02 PARTITION OF orders
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

---

**Última Atualização**: Janeiro/2026  
**Versão**: 1.0.0  
**Compatibilidade**: PostgreSQL 13+, Supabase
