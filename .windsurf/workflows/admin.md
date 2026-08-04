---
description: Como configurar servidor local para acessar página admin
---

# Como Acessar a Página Admin

## Problema: "Cannot GET"

Este erro ocorre porque você está tentando acessar `/admin` mas o arquivo se chama `admin.html`.

## Soluções:

### Opção 1: Acessar diretamente pelo arquivo
```
http://localhost/d:/Sites/Pastelaria/admin.html
```

### Opção 2: Usar servidor local (recomendado)

#### Com Python (se tiver instalado):
```bash
# Navegar até a pasta do projeto
cd d:\Sites\Pastelaria

# Iniciar servidor Python
python -m http.server 8000

# Acessar:
http://localhost:8000/admin.html
```

#### Com Node.js (se tiver instalado):
```bash
# Instalar serve globalmente
npm install -g serve

# Navegar até a pasta
cd d:\Sites\Pastelaria

# Iniciar servidor
serve -s . -p 8000

# Acessar:
http://localhost:8000/admin.html
```

#### Com PHP (se tiver instalado):
```bash
# Navegar até a pasta
cd d:\Sites\Pastelaria

# Iniciar servidor PHP
php -S localhost:8000

# Acessar:
http://localhost:8000/admin.html
```

### Opção 3: Usar extensão do VS Code

1. Instale a extensão "Live Server"
2. Clique com o botão direito em `admin.html`
3. Selecione "Open with Live Server"
4. A página abrirá automaticamente

### Opção 4: Configurar roteamento (avançado)

Se você quiser acessar `/admin` em vez de `/admin.html`, precisa configurar um servidor com regras de rewrite.

## Verificação

Após iniciar o servidor, teste:
1. **Site principal**: `http://localhost:8000/index.html`
2. **Página admin**: `http://localhost:8000/admin.html`

## Dicas

- **Porta 8000** é apenas exemplo, pode usar outra porta
- **Firewall**: Verifique se a porta não está bloqueada
- **Permissões**: Certifique-se que o servidor tem permissão para ler os arquivos