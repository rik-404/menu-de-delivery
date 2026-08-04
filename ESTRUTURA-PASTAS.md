# 📁 Estrutura de Pastas do Projeto

## 🏗️ Nova Organização

O projeto foi reestruturado para seguir melhores práticas de organização de código:

```
pastelaria-sistema/
├── 📄 index.html                 # Redirecionamento para o site principal
├── 📄 admin.html                 # Redirecionamento para o painel admin
├── 📄 login.html                 # Redirecionamento para a tela de login
├── 📄 README.md                  # Documentação principal
├── 📄 CHANGELOG.md               # Histórico de alterações
├── 📄 SUPABASE-README.md         # Guia de configuração Supabase
├── 📁 src/                       # Código fonte
│   ├── 📁 pages/                 # Páginas HTML
│   │   ├── 📄 index.html         # Site principal para clientes
│   │   ├── 📄 admin.html         # Painel administrativo
│   │   ├── 📄 login.html         # Tela de login
│   │   └── 📄 test-supabase-connection.html # Teste de conexão
│   ├── 📁 styles/                # Arquivos CSS
│   │   ├── 📁 pages/             # Estilos das páginas
│   │   │   ├── 📄 style.css      # Estilos do site principal
│   │   │   ├── 📄 admin.css      # Estilos do painel admin
│   │   │   └── 📄 login.css      # Estilos da tela de login
│   │   └── 📁 components/        # Estilos de componentes
│   │       ├── 📄 orders-table.css
│   │       ├── 📄 order-details-modal.css
│   │       ├── 📄 confirmation-modal.css
│   │       └── 📄 pending-notifications.css
│   └── 📁 scripts/               # Arquivos JavaScript
│       ├── 📁 components/        # Scripts das páginas
│       │   ├── 📄 script.js      # Lógica do site principal
│       │   └── 📄 admin.js       # Lógica do painel admin
│       ├── 📁 services/          # Serviços e configurações
│       │   ├── 📄 supabase-config.js
│       │   └── 📄 supabase-service.js
│       └── 📁 utils/             # Utilitários (futuro)
├── 📁 assets/                    # Recursos estáticos
│   ├── 📁 images/                # Imagens do projeto
│   └── 📁 audio/                 # Arquivos de áudio
├── 📁 config/                    # Arquivos de configuração
│   ├── 📄 fix-rls-policies.sql
│   └── 📄 test-supabase.sql
├── 📁 scripts/                   # Scripts de manutenção
│   └── 📄 temp-migration-fix.js
├── 📁 docs/                      # Documentação completa
│   ├── 📄 README.md
│   ├── 📄 DEVELOPMENT-GUIDE.md
│   ├── 📄 TESTING-GUIDE.md
│   ├── 📄 API-DOCUMENTATION.md
│   └── 📄 DATABASE-SCHEMA.md
└── 📁 .windsurf/                # Configurações do IDE
```

## 🔄 Mudanças Realizadas

### ✅ Remoção de Menções "Itoman"
- Substituição de todas as referências a "Itoman" por nomes genéricos
- Atualização de títulos, descrições e textos em todo o projeto
- Padronização para "Pastelaria" ou "Pastelaria do Cliente"

### ✅ Reorganização de Pastas
- **src/**: Código fonte organizado por tipo
- **assets/**: Recursos estáticos (imagens, áudios)
- **config/**: Arquivos de configuração e SQL
- **scripts/**: Scripts de manutenção e migração
- **docs/**: Documentação completa do projeto

### ✅ Atualização de Caminhos
- Correção de todas as referências relativas
- Manutenção da funcionalidade do sistema
- Redirecionamentos criados para compatibilidade

## 🚀 Como Usar

### Acesso ao Site
- Visite `index.html` → redireciona para `src/pages/index.html`

### Acesso Administrativo
- Visite `admin.html` → redireciona para `src/pages/admin.html`
- Login necessário através de `login.html`

### Desenvolvimento
- Edite os arquivos diretamente nas pastas correspondentes
- Mantenha a estrutura organizada para facilitar manutenção
- Siga os guias em `docs/` para desenvolvimento

## 📋 Benefícios

1. **Organização**: Separação clara de responsabilidades
2. **Manutenibilidade**: Fácil localização e edição de arquivos
3. **Escalabilidade**: Estrutura preparada para crescimento
4. **Profissionalismo**: Segue padrões da indústria
5. **Documentação**: Guias completos para desenvolvimento

---

**Atualizado em**: 31 de Março de 2026  
**Responsável**: Reestruturação completa do projeto
