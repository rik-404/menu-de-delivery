---
description: Como acessar a página admin com autenticação
---

# Acesso à Administração

## 🔐 **Credenciais Padrão**

- **Usuário**: `admin`
- **Senha**: `pastelaria123`

## 📋 **Fluxo de Acesso**

### 1. **Tentativa de Acesso Direto**
```
http://localhost:8000/admin.html
```
**Resultado**: Redirecionado automaticamente para `login.html`

### 2. **Login**
1. Acesse: `http://localhost:8000/login.html`
2. Digite usuário: `admin`
3. Digite senha: `pastelaria123`
4. Clique em "Entrar"

### 3. **Acesso Autorizado**
Após login válido:
- Redirecionado para `admin.html`
- Sessão ativa por **2 horas**
- Logout automático após **30 minutos** de inatividade

## ⚙️ **Segurança Implementada**

### **Proteções:**
- ✅ **Redirecionamento automático** se não autenticado
- ✅ **Sessão temporária** (2 horas)
- ✅ **Timeout por inatividade** (30 minutos)
- ✅ **Verificação em múltiplas camadas**
- ✅ **Botão de logout** no painel

### **Armazenamento:**
- `sessionStorage` (limpo ao fechar navegador)
- `adminAuthenticated`: status do login
- `adminLoginTime`: timestamp do login

## 🚨 **Importante**

### **Para Produção:**
1. **Altere as credenciais** padrão
2. **Use HTTPS** em produção
3. **Considere backend** com autenticação real
4. **Implemente rate limiting** contra brute force

### **Sugestões de Melhoria:**
- Banco de dados para usuários
- Senhas criptografadas
- 2FA (Autenticação de dois fatores)
- Logs de acesso
- Recuperação de senha

## 🔧 **Como Alterar Credenciais**

Edite o arquivo `login.html`:
```javascript
const DEFAULT_CREDENTIALS = {
    username: 'NOVO_USUARIO',
    password: 'NOVA_SENHA'
};
```

## 📱 **Acesso Mobile**

O login é **totalmente responsivo** e funciona em:
- Desktop
- Tablet
- Smartphones

## 🔄 **Logout**

### **Manual:**
Clique no botão **"Sair"** na navegação do painel

### **Automático:**
- Após 2 horas de sessão
- Após 30 minutos de inatividade
- Ao fechar o navegador
